import { HTTP_CODES } from "../helpers/httpCodes.js";
import { AppError, ValidationError } from "../helpers/exeptions.js";
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
  console.log(err.stack);

  const statusCode = err.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR;

  // manage Exceptions
  if (err instanceof AppError) {
    res.formatError(err.message, statusCode);
  } else if (err instanceof ValidationError) {
    res.formatError(err.details, err.statusCode);
  } else {
    // unexpected error:
    res.formatError("Algo salió mal", statusCode);
  }
};
