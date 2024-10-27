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
    const { user, token } = await this.#authService.login(req.body);

    // 3 - set cookie and response to client
    res.cookie("token", token, COOKIE_SETTINGS);
    res.formatResponse({ user }, "User logged in successfully");
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

  // not implmented yet
  async forgotPassword(req, res) {}
}
