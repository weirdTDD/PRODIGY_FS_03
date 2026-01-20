import jwt from 'jsonwebtoken';
import { Response } from 'express';

export interface TokenPayload {
  userId: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const sendTokenResponse = (
  user: any,
  statusCode: number,
  res: Response
): void => {
  const token = generateToken({
    userId: user._id.toString(),
    role: user.role
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      addresses: user.addresses
    }
  });
};
