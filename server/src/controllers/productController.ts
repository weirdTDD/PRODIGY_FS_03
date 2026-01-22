import { Request, Response } from "express";
import Product from "../models/Product";
import { asyncHandler } from "../utils/asyncHandler";
import { NotFoundError } from "../utils/errors";
import { AuthRequest } from "../middleware/auth";
import { FilterQuery } from "mongoose";

/* -----------------------------
   Types for query parameters
------------------------------ */
type ProductSort =
  | "price-asc"
  | "price-desc"
  | "rating"
  | "popular"
  | "newest";

type GetProductsQuery = {
  page?: string;
  limit?: string;
  category?: string;
  condition?: string;
  size?: string;
  available?: string; // "true" | "false"
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  sort?: ProductSort | string;
};

/* -----------------------------
   Helpers
------------------------------ */
const parseIntOr = (v: unknown, fallback: number) => {
  const n = Number.parseInt(String(v), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const parseFloatOrUndefined = (v: unknown) => {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number.parseFloat(String(v));
  return Number.isFinite(n) ? n : undefined;
};

const parseBoolOrUndefined = (v: unknown) => {
  if (v === undefined || v === null || v === "") return undefined;
  if (String(v).toLowerCase() === "true") return true;
  if (String(v).toLowerCase() === "false") return false;
  return undefined;
};

/* -----------------------------
   @desc    Get all products
   @route   GET /api/products
   @access  Public
------------------------------ */
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as unknown as GetProductsQuery;

  const page = parseIntOr(q.page, 1);
  const limit = parseIntOr(q.limit, 12);
  const skip = (page - 1) * limit;

  const queryObj: FilterQuery<any> = {};

  if (q.category) queryObj.category = q.category;
  if (q.condition) queryObj.condition = q.condition;
  if (q.size) queryObj.size = q.size;

  const available = parseBoolOrUndefined(q.available);
  if (available !== undefined) queryObj.isAvailable = available;

  const minPrice = parseFloatOrUndefined(q.minPrice);
  const maxPrice = parseFloatOrUndefined(q.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    queryObj.price = {};
    if (minPrice !== undefined) queryObj.price.$gte = minPrice;
    if (maxPrice !== undefined) queryObj.price.$lte = maxPrice;
  }

  if (q.search) {
    queryObj.$or = [
      { name: { $regex: q.search, $options: "i" } },
      { description: { $regex: q.search, $options: "i" } },
    ];
  }

  let sort: Record<string, 1 | -1> = { createdAt: -1 };
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

  const products = await Product.find(queryObj)
    .populate("category", "name slug")
    .sort(sort)
    .limit(limit)
    .skip(skip);

  const total = await Product.countDocuments(queryObj);

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
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name slug")
    .populate({
      path: "reviews",
      populate: { path: "user", select: "username avatar" },
    });

  if (!product) throw new NotFoundError("Product not found");

  product.views += 1;
  await product.save();

  res.status(200).json({ success: true, data: product });
});

/* -----------------------------
   @desc    Get product by slug
   @route   GET /api/products/slug/:slug
   @access  Public
------------------------------ */
export const getProductBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "username avatar" },
      });

    if (!product) throw new NotFoundError("Product not found");

    product.views += 1;
    await product.save();

    res.status(200).json({ success: true, data: product });
  }
);

/* -----------------------------
   @desc    Create new product
   @route   POST /api/products
   @access  Private/Admin
------------------------------ */
export const createProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const product = await Product.create(req.body);

    res.status(201).json({ success: true, data: product });
  }
);

/* -----------------------------
   @desc    Update product
   @route   PUT /api/products/:id
   @access  Private/Admin
------------------------------ */
export const updateProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) throw new NotFoundError("Product not found");

    res.status(200).json({ success: true, data: product });
  }
);

/* -----------------------------
   @desc    Delete product
   @route   DELETE /api/products/:id
   @access  Private/Admin
------------------------------ */
export const deleteProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) throw new NotFoundError("Product not found");

    res.status(200).json({ success: true, data: {} });
  }
);

/* -----------------------------
   @desc    Get featured products
   @route   GET /api/products/featured
   @access  Public
------------------------------ */
export const getFeaturedProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const q = req.query as unknown as { limit?: string };
    const limit = parseIntOr(q.limit, 8);

    const products = await Product.find({ isFeatured: true, isAvailable: true })
      .populate("category", "name slug")
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  }
);

/* -----------------------------
   @desc    Get related products
   @route   GET /api/products/:id/related
   @access  Public
------------------------------ */
export const getRelatedProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new NotFoundError("Product not found");

    const q = req.query as unknown as { limit?: string };
    const limit = parseIntOr(q.limit, 4);

    const relatedProducts = await Product.find({
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
  }
);
