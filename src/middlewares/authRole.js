import { ForbiddenError } from "../helpers/exeptions.js";

export default function authRole(role) {
  return function (req, _res, next) {
    if (req.user.role !== role) {
      throw new ForbiddenError(
        "You don't have permission to access this resource"
      );
    }
    next();
  };
}
