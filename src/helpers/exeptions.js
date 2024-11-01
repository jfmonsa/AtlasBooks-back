import { HTTP_CODES } from "./httpCodes.js";

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

export class UnauthorizedError extends AppError {
  constructor(message = "No autorizado") {
    super(message, HTTP_CODES.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "No tienes permisos para realizar esta acción") {
    super(message, HTTP_CODES.FORBIDDEN);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflicto") {
    super(message, HTTP_CODES.CONFLICT);
  }
}
