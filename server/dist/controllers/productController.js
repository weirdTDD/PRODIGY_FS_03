"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedProducts = exports.getFeaturedProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProduct = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const asyncHandler_1 = require("../utils/asyncHandler");
const errors_1 = require("../utils/errors");
/* -----------------------------
   Helpers
------------------------------ */
const parseIntOr = (v, fallback) => {
    const n = Number.parseInt(String(v), 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
};
const parseFloatOrUndefined = (v) => {
    if (v === undefined || v === null || v === "")
        return undefined;
    const n = Number.parseFloat(String(v));
    return Number.isFinite(n) ? n : undefined;
};
const parseBoolOrUndefined = (v) => {
    if (v === undefined || v === null || v === "")
        return undefined;
    if (String(v).toLowerCase() === "true")
        return true;
    if (String(v).toLowerCase() === "false")
        return false;
    return undefined;
};
/* -----------------------------
   @desc    Get all products
   @route   GET /api/products
   @access  Public
------------------------------ */
exports.getProducts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const q = req.query;
    const page = parseIntOr(q.page, 1);
    const limit = parseIntOr(q.limit, 12);
    const skip = (page - 1) * limit;
    const queryObj = {};
    if (q.category)
        queryObj.category = q.category;
    if (q.condition)
        queryObj.condition = q.condition;
    if (q.size)
        queryObj.size = q.size;
    const available = parseBoolOrUndefined(q.available);
    if (available !== undefined)
        queryObj.isAvailable = available;
    const minPrice = parseFloatOrUndefined(q.minPrice);
    const maxPrice = parseFloatOrUndefined(q.maxPrice);
    if (minPrice !== undefined || maxPrice !== undefined) {
        queryObj.price = {};
        if (minPrice !== undefined)
            queryObj.price.$gte = minPrice;
        if (maxPrice !== undefined)
            queryObj.price.$lte = maxPrice;
    }
    if (q.search) {
        queryObj.$or = [
            { name: { $regex: q.search, $options: "i" } },
            { description: { $regex: q.search, $options: "i" } },
        ];
    }
    let sort = { createdAt: -1 };
    switch (q.sort) {
        case "price-asc":
            sort = { price: 1 };
            break;
        case "price-desc":
            sort = { price: -1 };
            break;
        case "rating":
            sort = { ratings: -1 };
            break;
        case "popular":
            sort = { views: -1 };
            break;
        case "newest":
            sort = { createdAt: -1 };
            break;
        default:
            sort = { createdAt: -1 };
            break;
    }
    const products = await Product_1.default.find(queryObj)
        .populate("category", "name slug")
        .sort(sort)
        .limit(limit)
        .skip(skip);
    const total = await Product_1.default.countDocuments(queryObj);
    res.status(200).json({
        success: true,
        count: products.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: products,
    });
});
/* -----------------------------
   @desc    Get single product
   @route   GET /api/products/:id
   @access  Public
------------------------------ */
exports.getProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Product_1.default.findById(req.params.id)
        .populate("category", "name slug")
        .populate({
        path: "reviews",
        populate: { path: "user", select: "username avatar" },
    });
    if (!product)
        throw new errors_1.NotFoundError("Product not found");
    product.views += 1;
    await product.save();
    res.status(200).json({ success: true, data: product });
});
/* -----------------------------
   @desc    Get product by slug
   @route   GET /api/products/slug/:slug
   @access  Public
------------------------------ */
exports.getProductBySlug = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Product_1.default.findOne({ slug: req.params.slug })
        .populate("category", "name slug")
        .populate({
        path: "reviews",
        populate: { path: "user", select: "username avatar" },
    });
    if (!product)
        throw new errors_1.NotFoundError("Product not found");
    product.views += 1;
    await product.save();
    res.status(200).json({ success: true, data: product });
});
/* -----------------------------
   @desc    Create new product
   @route   POST /api/products
   @access  Private/Admin
------------------------------ */
exports.createProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Product_1.default.create(req.body);
    res.status(201).json({ success: true, data: product });
});
/* -----------------------------
   @desc    Update product
   @route   PUT /api/products/:id
   @access  Private/Admin
------------------------------ */
exports.updateProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!product)
        throw new errors_1.NotFoundError("Product not found");
    res.status(200).json({ success: true, data: product });
});
/* -----------------------------
   @desc    Delete product
   @route   DELETE /api/products/:id
   @access  Private/Admin
------------------------------ */
exports.deleteProduct = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Product_1.default.findByIdAndDelete(req.params.id);
    if (!product)
        throw new errors_1.NotFoundError("Product not found");
    res.status(200).json({ success: true, data: {} });
});
/* -----------------------------
   @desc    Get featured products
   @route   GET /api/products/featured
   @access  Public
------------------------------ */
exports.getFeaturedProducts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const q = req.query;
    const limit = parseIntOr(q.limit, 8);
    const products = await Product_1.default.find({ isFeatured: true, isAvailable: true })
        .populate("category", "name slug")
        .limit(limit)
        .sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        count: products.length,
        data: products,
    });
});
/* -----------------------------
   @desc    Get related products
   @route   GET /api/products/:id/related
   @access  Public
------------------------------ */
exports.getRelatedProducts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await Product_1.default.findById(req.params.id);
    if (!product)
        throw new errors_1.NotFoundError("Product not found");
    const q = req.query;
    const limit = parseIntOr(q.limit, 4);
    const relatedProducts = await Product_1.default.find({
        category: product.category,
        _id: { $ne: product._id },
        isAvailable: true,
    })
        .populate("category", "name slug")
        .limit(limit)
        .sort({ ratings: -1 });
    res.status(200).json({
        success: true,
        count: relatedProducts.length,
        data: relatedProducts,
    });
});
//# sourceMappingURL=productController.js.map