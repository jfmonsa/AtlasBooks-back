import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../helpers/exeptions.js";
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
      throw new ValidationError("User already exists");
    }

    const passwordHash = await this.#hashPassword(password);

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
      throw new UnauthorizedError("nickname, email or password is incorrect");
    } else if (!user.isActive) {
      throw new ForbiddenError("user is not active", HTTP_CODES.BAD_REQUEST);
    }

    const isValidPassword = await bcrypt.compare(userPassword, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError("nickname, email or password is incorrect");
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
      throw new ForbiddenError("User is not active");
    }

    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.#userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundError("User not exists", HTTP_CODES.NOT_FOUND);
    }

    const isValidPassword = await bcrypt.compare(
      user.password,
      currentPassword
    );

    if (isValidPassword) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    const newPasswordHashed = await this.#hashPassword(newPassword);

    await this.#userRepository.updateUserPassword(userId, newPasswordHashed);
  }

  #hashPassword(password) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    return bcrypt.hash(password, saltRounds);
  }
}
