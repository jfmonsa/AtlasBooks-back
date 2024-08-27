import { CustomError } from "../middlewares/errorMiddleware.js";
import { AuthService } from "../services/auth.js";

export class AuthController {
  /**
   * Logs in a user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the login process is complete.
   * @throws {CustomError} - If required fields are missing.
   */
  static async login(req, res) {
    const { userNickname: userNicknameOrEmail, userPassword } = req.body;

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
    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      httpOnly: false,
    });
    res.status(200).json(user);
  }

  static async logout(req, res) {}

  /**
   * Registers a new user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the registration is successful.
   * @throws {CustomError} - If any required field is missing.
   */
  static async register(req, res) {
    const { name, email, password, nickName, country } = req.body;

    // 1 - validations
    if (!name || !email || !password || !nickName || !country) {
      throw new CustomError("Missing fields", 400);
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
    // TODO: crear un middleware o helper que ayude a tener una respuesta uniforme en toda la app
    res.cookie("token", token);
    res.status(201).json({
      status: "success",
      data: { user: newUser, message: "User created successfully" },
    });
  }

  static async forgotPassword(req, res) {}

  static async verifyToken(req, res) {}
}
