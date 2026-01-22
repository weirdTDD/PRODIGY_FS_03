"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../utils/errors");
const errorHandler = (err, _req, res, _next) => {
    let error = { ...err };
    error.message = err.message;
    // Log to console for dev
    console.error(err);
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new errors_1.ErrorResponse(message, 404);
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        error = new errors_1.ErrorResponse(message, 409);
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(', ');
        error = new errors_1.ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map