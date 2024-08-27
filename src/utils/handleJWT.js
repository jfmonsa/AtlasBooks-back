import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function createAccessToken(payload) {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
  } catch (error) {
    throw new CustomError("Error creating access token", 500);
  }
}

export const tokenVerify = async token => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
