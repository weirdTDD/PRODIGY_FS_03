import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { sendTokenResponse } from '../utils/jwt';
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ConflictError
} from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, phone } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      throw new ValidationError('Please provide username, email, and password');
    }

    // Check if user exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (userExists) {
      throw new ConflictError(
        userExists.email === email
          ? 'Email already registered'
          : 'Username already taken'
      );
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      phone
    });

    sendTokenResponse(user, 201, res);
  }
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      throw new ValidationError('Please provide email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    sendTokenResponse(user, 200, res);
  }
);

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user
    });
  }
);

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const fieldsToUpdate = {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      avatar: req.body.avatar
    };

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  }
);

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);

    if (!isMatch) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  }
);

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  }
);

// @desc    Add address
// @route   POST /api/auth/addresses
// @access  Private
export const addAddress = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError('User not found');
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
  }
);

// @desc    Update address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
export const updateAddress = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      throw new NotFoundError('Address not found');
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
  }
);

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
export const deleteAddress = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.addresses = user.addresses.filter(
      (addr) => addr._id?.toString() !== req.params.addressId
    );

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  }
);
