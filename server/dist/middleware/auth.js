"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, _res, next) => {
    try {
        let token;
        // Check for token in Authorization header
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Check for token in cookies
        else if (req.cookies.token) {
            token = req.cookies.token;
        }
        // Make sure token exists
        if (!token) {
            throw new errors_1.UnauthorizedError('Not authorized to access this route');
        }
        try {
            // Verify token
            const decoded = (0, jwt_1.verifyToken)(token);
            if (!decoded) {
                throw new errors_1.UnauthorizedError('Invalid token');
            }
            // Get user from database
            const user = await User_1.default.findById(decoded.userId).select('-password');
            if (!user) {
                throw new errors_1.UnauthorizedError('User not found');
            }
            req.user = user;
            next();
        }
        catch (error) {
            throw new errors_1.UnauthorizedError('Not authorized to access this route');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new errors_1.UnauthorizedError('User not authenticated'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errors_1.ForbiddenError(`User role '${req.user.role}' is not authorized to access this route`));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map