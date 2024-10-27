/**
 * Middleware function that checks the requested API version against the specified version.
 * @param {number} version - The version number to compare against.
 * @returns {Function} - The actual middleware function.
 */
export default function apiVersionMiddleware(version) {
  return function (req, _res, next) {
    // removes the "v" and turns into a number
    const requestVersion = parseInt(req.params.version.substring(1));

    if (typeof requestVersion !== "number") {
      return next(new Error("Invalid API version requested."));
    } else if (requestVersion >= version) {
      return next();
    }
    // skip to the next route
    return next("route");
  };
}
