"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const asyncHandler_1 = require("../utils/asyncHandler");
const errors_1 = require("../utils/errors");
// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    let cart = await Cart_1.default.findOne({ user: req.user._id }).populate({
        path: 'items.product',
        select: 'name price images stock isAvailable'
    });
    if (!cart) {
        cart = await Cart_1.default.create({ user: req.user._id, items: [] });
    }
    res.status(200).json({
        success: true,
        data: cart
    });
});
// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
exports.addToCart = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const { productId, quantity, size, color } = req.body;
    if (!productId || !quantity || !size) {
        throw new errors_1.ValidationError('Please provide product, quantity, and size');
    }
    // Check if product exists and is available
    const product = await Product_1.default.findById(productId);
    if (!product) {
        throw new errors_1.NotFoundError('Product not found');
    }
    if (!product.isAvailable) {
        throw new errors_1.ValidationError('Product is not available');
    }
    if (product.stock < quantity) {
        throw new errors_1.ValidationError(`Only ${product.stock} items available in stock`);
    }
    let cart = await Cart_1.default.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart_1.default.create({ user: req.user._id, items: [] });
    }
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId &&
        item.size === size &&
        item.color === color);
    if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += quantity;
    }
    else {
        // Add new item
        cart.items.push({
            product: productId,
            quantity,
            price: product.price,
            size,
            color
        });
    }
    await cart.save();
    cart = await Cart_1.default.findById(cart._id).populate({
        path: 'items.product',
        select: 'name price images stock isAvailable'
    });
    res.status(200).json({
        success: true,
        data: cart
    });
});
// @desc    Update cart item
// @route   PUT /api/cart/items/:itemId
// @access  Private
exports.updateCartItem = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
        throw new errors_1.ValidationError('Please provide a valid quantity');
    }
    let cart = await Cart_1.default.findOne({ user: req.user._id });
    if (!cart) {
        throw new errors_1.NotFoundError('Cart not found');
    }
    const item = cart.items.find((cartItem) => cartItem._id?.toString() === req.params.itemId);
    if (!item) {
        throw new errors_1.NotFoundError('Item not found in cart');
    }
    // Check stock availability
    const product = await Product_1.default.findById(item.product);
    if (!product) {
        throw new errors_1.NotFoundError('Product not found');
    }
    if (product.stock < quantity) {
        throw new errors_1.ValidationError(`Only ${product.stock} items available in stock`);
    }
    item.quantity = quantity;
    await cart.save();
    cart = await Cart_1.default.findById(cart._id).populate({
        path: 'items.product',
        select: 'name price images stock isAvailable'
    });
    res.status(200).json({
        success: true,
        data: cart
    });
});
// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
exports.removeFromCart = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const cart = await Cart_1.default.findOne({ user: req.user._id });
    if (!cart) {
        throw new errors_1.NotFoundError('Cart not found');
    }
    cart.items = cart.items.filter((item) => item._id?.toString() !== req.params.itemId);
    await cart.save();
    const updatedCart = await Cart_1.default.findById(cart._id).populate({
        path: 'items.product',
        select: 'name price images stock isAvailable'
    });
    res.status(200).json({
        success: true,
        data: updatedCart
    });
});
// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const cart = await Cart_1.default.findOne({ user: req.user._id });
    if (!cart) {
        throw new errors_1.NotFoundError('Cart not found');
    }
    cart.items = [];
    await cart.save();
    res.status(200).json({
        success: true,
        data: cart
    });
});
//# sourceMappingURL=cartController.js.map