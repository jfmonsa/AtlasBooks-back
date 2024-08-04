/**
 * Custom error class
 * @extends Error
 * @description Custom error class to throw error in controllers
 */
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Error middleware
 * @param {Object} err
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description Error middleware to handle errors
 */
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export { CustomError, errorMiddleware };
