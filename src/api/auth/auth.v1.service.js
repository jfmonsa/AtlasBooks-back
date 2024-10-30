import { AppError, UnauthorizedError } from "../../helpers/exeptions.js";
import bcrypt from "bcryptjs";
import { HTTP_CODES } from "../../helpers/httpCodes.js";

export default class AuthService {
  #userRepository;
  #createAccessToken;
  #verifyTokenDep;

  constructor({ userRepository, createAccessToken, verifyToken }) {
    this.#userRepository = userRepository;
    this.#createAccessToken = createAccessToken;
    this.#verifyTokenDep = verifyToken;
  }

  async register({ fullName, nickname, email, password, country }) {
    const userExists =
      (await this.#userRepository.getUserByEmail(email)) ||
      (await this.#userRepository.getUserByNickname(nickname));

    if (userExists) {
      throw new AppError("User already exists", 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await this.#userRepository.createUserWithDetails({
      fullName,
      email,
      password: passwordHash,
      nickname,
      country,
    });

    delete newUser.password;
    const token = this.#createAccessToken(newUser);

    return {
      newUser,
      token,
    };
  }

  /**
   * Authenticates a user by their nickname or email and password.
   *
   * @param {string} userNicknameOrEmail - The nickname or email of the user.
   * @param {string} userPassword - The password of the user.
   * @returns {Promise<Object>} - A promise that resolves to an object containing the authenticated user and access token.
   * @throws {AppError} - Throws a custom error if the user is not registered, not active, or if the password is incorrect.
   */
  async login({ userNicknameOrEmail, userPassword }) {
    const user =
      await this.#userRepository.getUserByNicknameOrEmail(userNicknameOrEmail);

    if (!user) {
      throw new AppError(
        "nickname, email or password is incorrect",
        HTTP_CODES.BAD_REQUEST
      );
    } else if (!user.isActive) {
      throw new AppError("user is not active", HTTP_CODES.BAD_REQUEST);
    }

    const isValidPassword = await bcrypt.compare(userPassword, user.password);

    if (!isValidPassword) {
      throw new AppError(
        "userNickname or password is incorrect",
        HTTP_CODES.BAD_REQUEST
      );
    }

    delete user.password;
    const token = this.#createAccessToken(user);

    return {
      user,
      token,
    };
  }

  async verifyToken(token) {
    const user = await this.#verifyTokenDep(token);

    // TODO: validar los roles: admin, user premium, user basic
    // TODO: implement refresh + access token strategy
    // @see https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js/
    if (!user.isActive) {
      throw new UnauthorizedError("User is not active");
    }

    return user;
  }
}
