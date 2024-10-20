import { HTTP_CODES } from "../../../../common/httpCodes.js";
import { AppError } from "../../../../common/exeptions.js";

import { AuthService } from "./auth.service.js";

const COOKIE_SETTINGS = {
  sameSite: "none",
  secure: true,
  httpOnly: true,
};

export class AuthController {
  /**
   * Logs in a user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the login process is complete.
   */
  static async login(req, res) {
    // TODO: cambiar userNickname por userNicknameOrEmail
    const { userNicknameOrEmail, userPassword } = req.body;

    //TODO: val things with express validator
    //TODO: also validate confirm password equals to password and drop user prefix in property values
    // 1 - req validations
    if (!userNicknameOrEmail || !userPassword) {
      throw new CustomError("Missing fields", 400);
    }

    // 2 - pass data to service and get data of user and token
    const { user, token } = await AuthService.login(
      userNicknameOrEmail,
      userPassword
    );

    // 3 - set cookie and response to client
    res.cookie("token", token, COOKIE_SETTINGS);
    res.status(200).success(user);
  }

  static async register(req, res) {
    const { name, email, password, nickName, country } = req.body;

    // 1 - validations
    if (!name || !email || !password || !nickName || !country) {
      throw new AppError("Missing fields", 400);
    }

    // 2 - pass data to service and get data of new user and token
    const { newUser, token } = await AuthService.register(
      name,
      email,
      password,
      nickName,
      country
    );

    // 3 - set cookie and send response to client
    res
      .cookie("token", token, COOKIE_SETTINGS)
      .formatResponse(
        { user: newUser, message: "User created successfully" },
        HTTP_CODES.CREATED
      );
  }

  /**
   * Verifies the token sent in the request and sends a response to the client.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   * @throws {CustomError} - If the token is not sent.
   */
  static async verifyToken(req, res) {
    const { token } = req.cookies;

    // 1 - val if token was sent
    if (!token) {
      throw new CustomError("Token not wasn't sent", 401);
    }

    // 2 - pass data to service and get data of user
    const user = await AuthService.verifyToken(token);

    // 3 - send response to client
    res.status(200).success({ user, message: "Token is valid" });
  }

  // TODO: esto donde se esta usando ??
  static async verifyTokenEmail(req, res) {
    const { token } = req.body;

    if (!token) {
      throw new CustomError("Not_Token", 401);
    }
    const user = await AuthService.verifyEmail(token);
    res.status(200).success({ user, message: "Token is valid" });
  }

  // not implmented yet
  static async forgotPassword(req, res) {}
}
