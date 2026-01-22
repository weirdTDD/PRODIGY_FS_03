"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.addAddress = exports.logout = exports.updatePassword = exports.updateDetails = exports.getMe = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const asyncHandler_1 = require("../utils/asyncHandler");
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const { username, email, password, phone } = req.body;
    // Validate required fields
    if (!username || !email || !password) {
        throw new errors_1.ValidationError('Please provide username, email, and password');
    }
    // Check if user exists
    const userExists = await User_1.default.findOne({
        $or: [{ email }, { username }]
    });
    if (userExists) {
        throw new errors_1.ConflictError(userExists.email === email
            ? 'Email already registered'
            : 'Username already taken');
    }
    // Create user
    const user = await User_1.default.create({
        username,
        email,
        password,
        phone
    });
    (0, jwt_1.sendTokenResponse)(user, 201, res);
});
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const { email, password } = req.body;
    // Validate email & password
    if (!email || !password) {
        throw new errors_1.ValidationError('Please provide email and password');
    }
    // Check for user
    const user = await User_1.default.findOne({ email }).select('+password');
    if (!user) {
        throw new errors_1.UnauthorizedError('Invalid credentials');
    }
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new errors_1.UnauthorizedError('Invalid credentials');
    }
    (0, jwt_1.sendTokenResponse)(user, 200, res);
});
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const user = await User_1.default.findById(req.user._id);
    res.status(200).json({
        success: true,
        data: user
    });
});
// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const fieldsToUpdate = {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        avatar: req.body.avatar
    };
    const user = await User_1.default.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: user
    });
});
// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const user = await User_1.default.findById(req.user._id).select('+password');
    if (!user) {
        throw new errors_1.NotFoundError('User not found');
    }
    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
        throw new errors_1.UnauthorizedError('Current password is incorrect');
    }
    user.password = req.body.newPassword;
    await user.save();
    (0, jwt_1.sendTokenResponse)(user, 200, res);
});
// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (0, asyncHandler_1.asyncHandler)(async (_req, res, _next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        data: {}
    });
});
// @desc    Add address
// @route   POST /api/auth/addresses
// @access  Private
exports.addAddress = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const user = await User_1.default.findById(req.user._id);
    if (!user) {
        throw new errors_1.NotFoundError('User not found');
    }
    // If this is the first address or marked as default, set it as default
    if (user.addresses.length === 0 || req.body.isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
        req.body.isDefault = true;
    }
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({
        success: true,
        data: user
    });
});
// @desc    Update address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
exports.updateAddress = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const user = await User_1.default.findById(req.user._id);
    if (!user) {
        throw new errors_1.NotFoundError('User not found');
    }
    const address = user.addresses.id(req.params.addressId);
    if (!address) {
        throw new errors_1.NotFoundError('Address not found');
    }
    // If setting this address as default, unset others
    if (req.body.isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
    }
    Object.assign(address, req.body);
    await user.save();
    res.status(200).json({
        success: true,
        data: user
    });
});
// @desc    Delete address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
exports.deleteAddress = (0, asyncHandler_1.asyncHandler)(async (req, res, _next) => {
    const user = await User_1.default.findById(req.user._id);
    if (!user) {
        throw new errors_1.NotFoundError('User not found');
    }
    const address = user.addresses.id(req.params.addressId);
    if (!address) {
        throw new errors_1.NotFoundError('Address not found');
    }
    address.deleteOne();
    await user.save();
    res.status(200).json({
        success: true,
        data: user
    });
});
//# sourceMappingURL=authController.js.map