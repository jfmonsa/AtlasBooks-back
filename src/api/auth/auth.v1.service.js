import { AppError } from "../../helpers/exeptions.js";
import bcrypt from "bcryptjs";

export default class AuthService {
  #userRepository;
  #createAccessToken;
  #verifyToken;

  constructor({ userRepository, createAccessToken, verifyToken }) {
    this.#userRepository = userRepository;
    this.#createAccessToken = createAccessToken;
    this.#verifyToken = verifyToken;
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
  async login(userNicknameOrEmail, userPassword) {
    const user =
      await this.#userRepository.getUserByNicknameOrEmail(userNicknameOrEmail);

    if (!user) {
      throw new AppError("userNickname or password is incorrect", 400);
    } else if (!user.status) {
      throw new AppError("user is not active", 400);
    }

    const isValidPassword = await bcrypt.compare(userPassword, user.password);

    if (!isValidPassword) {
      throw new AppError("userNickname or password is incorrect", 400);
    }

    const token = this.#createAccessToken(user);

    return {
      user,
      token,
    };
  }

  async verifyToken(token) {
    // 1 - val if token is valid
    const dataToken = await tokenVerify(token);

    if (!dataToken?.id) {
      throw new AppError("Invalid token", 400);
    }

    // 3 - val if user exists
    const user = getUserById(dataToken.id);

    if (!user) {
      throw new AppError("User not found", 400);
    }

    // 4 - val if user is active
    if (!user.statusu) {
      throw new AppError("User is not active", 400);
    }

    // don't return the password :)
    delete user.passwordu;

    // 5 - return user
    return user;
  }

  // TODO: Estos dos controladores no son exactamente iguales xd? o cual es el motivo?
  async verifyEmail(token) {
    // 1 - val if token is valid
    const dataToken = await tokenVerify(token);

    if (!dataToken?.id) {
      throw new AppError("Invalid token", 400);
    }

    // 3 - val if user exists
    const user = getUserById(dataToken.id);

    if (!user) {
      throw new AppError("User not found", 400);
    }

    // 4 - val if user is active
    if (!user.statusu) {
      throw new AppError("User is not active", 400);
    }

    // don't return the password :)
    delete user.passwordu;

    // 5 - return user
    return user;
  }
}
