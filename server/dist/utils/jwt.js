"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTokenResponse = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error('JWT_SECRET is not set');
    const options = {
        expiresIn: (process.env.JWT_EXPIRES_IN)
    };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error('JWT_SECRET is not set');
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
const sendTokenResponse = (user, statusCode, res) => {
    const token = (0, exports.generateToken)({
        userId: user._id.toString(),
        role: user.role
    });
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
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
exports.sendTokenResponse = sendTokenResponse;
//# sourceMappingURL=jwt.js.map