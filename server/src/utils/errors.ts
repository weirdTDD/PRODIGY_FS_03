export class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ErrorResponse {
  errors: any;

  constructor(message: string, errors?: any) {
    super(message, 400);
    this.errors = errors;
  }
}

export class UnauthorizedError extends ErrorResponse {
  constructor(message: string = 'Not authorized to access this resource') {
    super(message, 401);
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(message: string = 'Access forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends ErrorResponse {
  constructor(message: string = 'Resource already exists') {
    super(message, 409);
  }
}
