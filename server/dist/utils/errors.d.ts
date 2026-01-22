export declare class ErrorResponse extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class ValidationError extends ErrorResponse {
    errors: any;
    constructor(message: string, errors?: any);
}
export declare class UnauthorizedError extends ErrorResponse {
    constructor(message?: string);
}
export declare class ForbiddenError extends ErrorResponse {
    constructor(message?: string);
}
export declare class NotFoundError extends ErrorResponse {
    constructor(message?: string);
}
export declare class ConflictError extends ErrorResponse {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map