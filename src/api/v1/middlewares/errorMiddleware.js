/**
 * Custom error class
 * @extends Error
 * @description Custom error class to throw error in controllers
 */
class CustomError extends Error {
  constructor(message, statusCode) {
    message = message || "Internal Server Error";
    statusCode = statusCode || 500;

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
 * @description Format response to client
 */
const errorHandler = (err, _req, res, _next) => {
  // log error
  console.error(err.stack);

  // formating response
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};

export { CustomError, errorHandler };

/*
NOTE:
+ https://simonplend.com/send-awesome-structured-error-responses-with-express/ intersting, maybe implement it in the future
+ https://medium.com/@ctrlaltvictoria/mastering-express-js-error-handling-from-custom-errors-to-enhanced-error-responses-5fda471d38d4
+ https://reflectoring.io/express-error-handling/ 

TODO: tener varias funciones de manejo de errores, dividir mejor las resposabilidades de este archivo
 distintas clases por cada tipo de errror
*/
