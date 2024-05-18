import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
/**
 * Se debe enviar el objeto del usuario
 * @param {*} payload
 */
export const tokenSign = async (user) => {
  const sign = jwt.sign(
    {
      id: user.id,
      role: user.isadmin,
      name: user.name,
      nick: user.nickname,
    },
    JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
  return sign;
};

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
