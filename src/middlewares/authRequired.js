import asyncErrorHandler from "../middlewares/asyncErrorHandler.js";

/**
 *  HoF which return a middleware that verify if the user is authenticated
 */
export default function authRequired({ authService }) {
  return asyncErrorHandler(async (req, _res, next) => {
    const user = await authService.verifyToken(req.cookies.token);

    req.user = user;
    next();
  });
}
