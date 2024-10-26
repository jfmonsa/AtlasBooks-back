import jwt from "jsonwebtoken";
import { AppError } from "./exeptions.js";

const JWT_SECRET = process.env.JWT_SECRET;

export function createAccessToken(payload) {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
  } catch (error) {
    throw new AppError("Error creating access token" + error, 500);
  }
}

export const verifyToken = async token => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};
