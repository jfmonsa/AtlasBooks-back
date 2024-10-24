import { HTTP_CODES } from "../../helpers/httpCodes.js";
import { AppError, ValidationError } from "../../helpers/exeptions.js";

const COOKIE_SETTINGS = {
  sameSite: "none",
  secure: true,
  httpOnly: true,
};

export default class AuthController {
  #authService;

  constructor({ authService }) {
    this.#authService = authService;

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.verifyToken = this.verifyToken.bind(this);
    this.verifyTokenEmail = this.verifyTokenEmail.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
  }

  async register(req, res) {
    // pass data to service and get data of new user and token
    const { newUser, token } = await this.#authService.register(req.body);

    // set cookie and send response to client
    res
      .cookie("token", token, COOKIE_SETTINGS)
      .formatResponse(
        { user: newUser },
        "User created successfully",
        HTTP_CODES.CREATED
      );
  }

  /**
   * Logs in a user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the login process is complete.
   */
  async login(req, res) {
    // TODO: cambiar userNickname por userNicknameOrEmail
    const { userNicknameOrEmail, userPassword } = req.body;

    // 1 - req validations
    if (!userNicknameOrEmail || !userPassword) {
      throw new AppError("Missing fields", 400);
    }

    // 2 - pass data to service and get data of user and token
    const { user, token } = await this.#authService.login(
      userNicknameOrEmail,
      userPassword
    );

    // 3 - set cookie and response to client
    res.cookie("token", token, COOKIE_SETTINGS);
    res.status(200).success(user);
  }

  /**
   * Verifies the token sent in the request and sends a response to the client.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   * @throws {CustomError} - If the token is not sent.
   */
  async verifyToken(req, res) {
    const { token } = req.cookies;

    // 1 - val if token was sent
    if (!token) {
      throw new ValidationError("Token not wasn't sent");
    }

    // 2 - pass data to service and get data of user
    const user = await this.#authService.verifyToken(token);

    // 3 - send response to client
    res.status(200).success({ user, message: "Token is valid" });
  }

  // TODO: esto donde se esta usando ??
  async verifyTokenEmail(req, res) {
    const { token } = req.body;

    if (!token) {
      throw new AppError("Not_Token", 401);
    }
    const user = await this.#authService.verifyEmail(token);
    res.status(200).success({ user, message: "Token is valid" });
  }

  // not implmented yet
  async forgotPassword(req, res) {}
}
