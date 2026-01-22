"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.updateOrderStatus = exports.getOrders = exports.updateOrderToPaid = exports.createPaymentIntent = exports.getOrderById = exports.getMyOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const asyncHandler_1 = require("../utils/asyncHandler");
const errors_1 = require("../utils/errors");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia'
});
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
    if (!items || items.length === 0) {
        throw new errors_1.ValidationError('No order items');
    }
    // Verify stock availability for all items
    for (const item of items) {
        const product = await Product_1.default.findById(item.product);
        if (!product) {
            throw new errors_1.NotFoundError(`Product ${item.name} not found`);
        }
        if (product.stock < item.quantity) {
            throw new errors_1.ValidationError(`Insufficient stock for ${product.name}. Only ${product.stock} available`);
        }
    }
    const order = await Order_1.default.create({
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
    await Cart_1.default.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(201).json({
        success: true,
        data: order
    });
});
// @desc    Get all orders for user
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const orders = await Order_1.default.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
    const total = await Order_1.default.countDocuments({ user: req.user._id });
    res.status(200).json({
        success: true,
        count: orders.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: orders
    });
});
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const order = await Order_1.default.findById(req.params.id).populate('user', 'username email');
    if (!order) {
        throw new errors_1.NotFoundError('Order not found');
    }
    // Make sure user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
        throw new errors_1.ValidationError('Not authorized to view this order');
    }
    res.status(200).json({
        success: true,
        data: order
    });
});
// @desc    Create Stripe payment intent
// @route   POST /api/orders/:id/payment-intent
// @access  Private
exports.createPaymentIntent = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const order = await Order_1.default.findById(req.params.id);
    if (!order) {
        throw new errors_1.NotFoundError('Order not found');
    }
    if (order.user.toString() !== req.user._id.toString()) {
        throw new errors_1.ValidationError('Not authorized to pay for this order');
    }
    if (order.isPaid) {
        throw new errors_1.ValidationError('Order is already paid');
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
});
// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const order = await Order_1.default.findById(req.params.id);
    if (!order) {
        throw new errors_1.NotFoundError('Order not found');
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
});
// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const queryObj = {};
    if (req.query.status) {
        queryObj.status = req.query.status;
    }
    if (req.query.isPaid) {
        queryObj.isPaid = req.query.isPaid === 'true';
    }
    const orders = await Order_1.default.find(queryObj)
        .populate('user', 'username email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
    const total = await Order_1.default.countDocuments(queryObj);
    res.status(200).json({
        success: true,
        count: orders.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: orders
    });
});
// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const { status, trackingNumber } = req.body;
    const order = await Order_1.default.findById(req.params.id);
    if (!order) {
        throw new errors_1.NotFoundError('Order not found');
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
});
// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const order = await Order_1.default.findById(req.params.id);
    if (!order) {
        throw new errors_1.NotFoundError('Order not found');
    }
    if (order.user.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
        throw new errors_1.ValidationError('Not authorized to cancel this order');
    }
    if (order.status === 'delivered') {
        throw new errors_1.ValidationError('Cannot cancel delivered order');
    }
    if (order.status === 'shipped') {
        throw new errors_1.ValidationError('Cannot cancel shipped order. Please contact support');
    }
    order.status = 'cancelled';
    // Restore stock if order was paid
    if (order.isPaid) {
        for (const item of order.items) {
            await Product_1.default.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity, sold: -item.quantity }
            });
        }
    }
    const updatedOrder = await order.save();
    res.status(200).json({
        success: true,
        data: updatedOrder
    });
});
//# sourceMappingURL=orderController.js.map