import errorHandler from "./errorHandler.js";

/**
 * @function authRequired
 * HoF which return a middleware that verify if the user is authenticated
 */
export default function authRequired({ authService }) {
  return errorHandler(async function (req, _res, next) {
    const user = await authService.verifyToken(req.cookies.token);

    req.user = user;
    next();
  });
}
