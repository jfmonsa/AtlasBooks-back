import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./exeptions.js";

const JWT_SECRET = process.env.JWT_SECRET;

export function createAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

export const verifyToken = async token => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new UnauthorizedError("Invalid token");
  }
};
