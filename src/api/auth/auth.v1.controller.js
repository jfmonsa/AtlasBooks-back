import { HTTP_CODES } from "../../helpers/httpCodes.js";
import { ValidationError } from "../../helpers/exeptions.js";

const COOKIE_SETTINGS = {
  secure: process.env.NODE_ENV === "prod",
  httpOnly: true,
};

export default class AuthController {
  #authService;

  constructor({ authService }) {
    this.#authService = authService;

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.verifyToken = this.verifyToken.bind(this);
    this.logout = this.logout.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  async register(req, res) {
    const { newUser, token } = await this.#authService.register(req.body);

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
    const { user, token } = await this.#authService.login(req.body);

    res.cookie("token", token, COOKIE_SETTINGS);
    res.formatResponse({ user }, "User logged in successfully");
  }

  /**
   * Verifies the token sent in the request and sends a response to the client.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async verifyToken(req, res) {
    const { token } = req.cookies;

    if (!token) {
      throw new ValidationError("Token not wasn't sent");
    }

    const user = await this.#authService.verifyToken(token);

    res.formatResponse({ user }, "Token verified successfully");
  }

  async logout(_req, res) {
    res.cookie("token", "", { expires: new Date(0) });
    res.sendStatus(HTTP_CODES.OK);
  }

  async forgotPassword(_req, _res) {
    throw new Error("Not implemented yet");
  }

  async changePassword(req, res) {
    const { id: userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    await this.#authService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    res.formatResponse(null, "Password changed successfully");
  }
}
