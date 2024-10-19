import { HTTP_CODES } from "./httpCodes";

// customErrors.js
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(message, HTTP_CODES.NOT_FOUND);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Error de validación") {
    super(message, HTTP_CODES.BAD_REQUEST);
  }
}
