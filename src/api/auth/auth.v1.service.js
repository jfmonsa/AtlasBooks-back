import { AppError } from "../../helpers/exeptions.js";
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
    const dataToken = await this.#verifyTokenDep(token);

    if (!dataToken?.id) {
      throw new AppError("Invalid token", HTTP_CODES.BAD_REQUEST);
    }

    const user = await this.#userRepository.getUserById(dataToken.id);

    if (!user) {
      throw new AppError("User not found", HTTP_CODES.BAD_REQUEST);
    }

    if (!user.isActive) {
      throw new AppError("User is not active", HTTP_CODES.BAD_REQUEST);
    }

    delete user.password;
    return user;
  }
}
