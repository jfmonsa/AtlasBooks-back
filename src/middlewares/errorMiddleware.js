import { HTTP_CODES } from "../utils/httpCodes.js";
import { AppError } from "../utils/exeptions.js";
/**
 * Error middleware
 * @param {Object} err
 * @param {Object} _req
 * @param {Object} res
 * @param {Function} _next
 * @description Format response to client
 */
export const errorHandler = (err, _req, res, _next) => {
  // log error
  // TODO: use logger like winston
  console.error(err.stack);

  const statusCode = err.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR;

  // manage Exceptions
  if (err instanceof AppError) {
    res.formatError(err.message, statusCode);
  } else {
    // TODO: handle validation errors else-if
    // unexpected error:
    res.formatError("Algo salió mal", statusCode);
  }
};
