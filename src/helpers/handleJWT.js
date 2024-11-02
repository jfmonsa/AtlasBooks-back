import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./exeptions.js";

const JWT_SECRET = process.env.JWT_SECRET;

export function createAccessToken(payload, options, secret = JWT_SECRET) {
  return jwt.sign(payload, secret, options);
}

export const verifyToken = async (token, secret = JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    throw new UnauthorizedError("Invalid token");
  }
};
