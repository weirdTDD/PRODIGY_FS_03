import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      throw new UnauthorizedError('Not authorized to access this route');
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      if (!decoded) {
        throw new UnauthorizedError('Invalid token');
      }

      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      req.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedError('Not authorized to access this route');
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `User role '${req.user.role}' is not authorized to access this route`
        )
      );
    }

    next();
  };
};
