import { HTTP_CODES } from "../httpCodes.js";

/** Middleware to format responses
 *
 * define custom functions to res object, this functions will
 * be used in controllers and in error middleware
 */
export const formatResponse = (req, res, next) => {
  // for success responses
  res.formatResponse = (data, message, statusCode = HTTP_CODES.OK) => {
    res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  };

  // for error responses
  res.formatError = (error, statusCode) => {
    res.status(statusCode).json({
      success: false,
      statusCode,
      error,
      metadata: {
        date: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  };
  next();
};

// based on:
// 1. https://github.com/omniti-labs/jsend
// 2. https://quilltez.com/blog/maintaining-standard-rest-api-response-format-expressjs
