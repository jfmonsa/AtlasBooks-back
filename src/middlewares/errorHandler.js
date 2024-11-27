/**
 * A middleware function to handle errors in asynchronous route handlers.
 *
 * This utility function wraps an sync and asyn function (controllers) function in a try-catch block,
 * ensuring that any errors are passed to the next middleware in the Express.js stack.
 *
 * @function
 * @param {Function} controller - The controller function to be wrapped.
 * @returns {Function} A middleware function that handles errors for the provided controller.
 */
export default function errorHandler(controller) {
  return (req, res, next) => {
    try {
      return Promise.resolve(controller(req, res, next)).catch(next); // Promise.catch() handles async errors
    } catch (err) {
      next(err); // this catch block handles sync errors
    }
  };
}
