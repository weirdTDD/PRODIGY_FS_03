import { Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price images stock isAvailable'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  }
);

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { productId, quantity, size, color } = req.body;

    if (!productId || !quantity || !size) {
      throw new ValidationError('Please provide product, quantity, and size');
    }

    // Check if product exists and is available
    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (!product.isAvailable) {
      throw new ValidationError('Product is not available');
    }

    if (product.stock < quantity) {
      throw new ValidationError(
        `Only ${product.stock} items available in stock`
      );
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
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

    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price images stock isAvailable'
    });

    res.status(200).json({
      success: true,
      data: cart
    });
  }
);

// @desc    Update cart item
// @route   PUT /api/cart/items/:itemId
// @access  Private
export const updateCartItem = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      throw new ValidationError('Please provide a valid quantity');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      throw new NotFoundError('Item not found in cart');
    }

    // Check stock availability
    const product = await Product.findById(item.product);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.stock < quantity) {
      throw new ValidationError(
        `Only ${product.stock} items available in stock`
      );
    }

    item.quantity = quantity;
    await cart.save();

    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price images stock isAvailable'
    });

    res.status(200).json({
      success: true,
      data: cart
    });
  }
);

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
export const removeFromCart = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    cart.items = cart.items.filter(
      (item) => item._id?.toString() !== req.params.itemId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price images stock isAvailable'
    });

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  }
);

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  }
);
