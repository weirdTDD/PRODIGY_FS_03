import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const queryObj: any = {};

    // Filter by category
    if (req.query.category) {
      queryObj.category = req.query.category;
    }

    // Filter by condition
    if (req.query.condition) {
      queryObj.condition = req.query.condition;
    }

    // Filter by size
    if (req.query.size) {
      queryObj.size = req.query.size;
    }

    // Filter by availability
    if (req.query.available) {
      queryObj.isAvailable = req.query.available === 'true';
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) {
        queryObj.price.$gte = parseFloat(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        queryObj.price.$lte = parseFloat(req.query.maxPrice as string);
      }
    }

    // Search by name or description
    if (req.query.search) {
      queryObj.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sort
    let sort: any = { createdAt: -1 };
    if (req.query.sort) {
      const sortField = req.query.sort as string;
      if (sortField === 'price-asc') sort = { price: 1 };
      else if (sortField === 'price-desc') sort = { price: -1 };
      else if (sortField === 'rating') sort = { ratings: -1 };
      else if (sortField === 'popular') sort = { views: -1 };
      else if (sortField === 'newest') sort = { createdAt: -1 };
    }

    const products = await Product.find(queryObj)
      .populate('category', 'name slug')
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
      data: products
    });
  }
);

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'username avatar' }
      });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  }
);

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'username avatar' }
      });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  }
);

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  }
);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.status(200).json({
      success: true,
      data: product
    });
  }
);

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  }
);

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string) || 8;

    const products = await Product.find({ isFeatured: true, isAvailable: true })
      .populate('category', 'name slug')
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  }
);

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const limit = parseInt(req.query.limit as string) || 4;

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isAvailable: true
    })
      .populate('category', 'name slug')
      .limit(limit)
      .sort({ ratings: -1 });

    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts
    });
  }
);
