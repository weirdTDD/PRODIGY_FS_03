"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.ValidationError = exports.ErrorResponse = void 0;
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ErrorResponse = ErrorResponse;
class ValidationError extends ErrorResponse {
    constructor(message, errors) {
        super(message, 400);
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
class UnauthorizedError extends ErrorResponse {
    constructor(message = 'Not authorized to access this resource') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ErrorResponse {
    constructor(message = 'Access forbidden') {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends ErrorResponse {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends ErrorResponse {
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=errors.js.map