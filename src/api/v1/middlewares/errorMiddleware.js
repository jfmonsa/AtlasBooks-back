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
 * @param {Object} _req
 * @param {Object} res
 * @param {Function} _next
 * @description Error middleware to handle errors
 */
const errorMiddleware = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.statusCode == 500 ? message : "Internal Server Error";

  console.error(err);
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export { CustomError, errorMiddleware };

/*
NOTE:
+ https://simonplend.com/send-awesome-structured-error-responses-with-express/ intersting, maybe implement it in the future
*/
