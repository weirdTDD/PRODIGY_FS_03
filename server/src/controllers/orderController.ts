import { Response, NextFunction } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError, ValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-02-24.acacia",
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const {
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    } = req.body;

    if (!items || items.length === 0) {
      throw new ValidationError('No order items');
    }

    // Verify stock availability for all items
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new NotFoundError(`Product ${item.name} not found`);
      }

      if (product.stock < item.quantity) {
        throw new ValidationError(
          `Insufficient stock for ${product.name}. Only ${product.stock} available`
        );
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });

    // Clear cart after order is created
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    res.status(201).json({
      success: true,
      data: order
    });
  }
);

// @desc    Get all orders for user
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Order.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: orders
    });
  }
);

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'username email'
    );

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Make sure user owns this order or is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new ValidationError('Not authorized to view this order');
    }

    res.status(200).json({
      success: true,
      data: order
    });
  }
);

// @desc    Create Stripe payment intent
// @route   POST /api/orders/:id/payment-intent
// @access  Private
export const createPaymentIntent = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
      throw new ValidationError('Not authorized to pay for this order');
    }

    if (order.isPaid) {
      throw new ValidationError('Order is already paid');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'ghs', // Ghana Cedi
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  }
);

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };
    order.status = 'processing';

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  }
);

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const queryObj: any = {};

    if (req.query.status) {
      queryObj.status = req.query.status;
    }

    if (req.query.isPaid) {
      queryObj.isPaid = req.query.isPaid === 'true';
    }

    const orders = await Order.find(queryObj)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Order.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: orders
    });
  }
);

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    order.status = status;

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  }
);

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new ValidationError('Not authorized to cancel this order');
    }

    if (order.status === 'delivered') {
      throw new ValidationError('Cannot cancel delivered order');
    }

    if (order.status === 'shipped') {
      throw new ValidationError(
        'Cannot cancel shipped order. Please contact support'
      );
    }

    order.status = 'cancelled';

    // Restore stock if order was paid
    if (order.isPaid) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sold: -item.quantity }
        });
      }
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  }
);
