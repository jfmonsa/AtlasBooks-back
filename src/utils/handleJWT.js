import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
/**
 * Se debe enviar el objeto del usuario
 * @param {*} payload
 */
export function tokenSign(user) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        id: user.id,
        role: user.isadmin,
        name: user.nameu,
        nick: user.nickname,
        email: user.email,
        path: user.pathprofilepic,
        country: user.country,
      },
      JWT_SECRET,
      {
        expiresIn: "2h",
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
}

/**
 * Se debe de enviar el tokenJWT de session
 * @param {*} token
 * @returns
 */
export const tokenVerify = async (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
