import { AppError } from "../../helpers/exeptions.js";
import bycript from "bcryptjs";
import { createAccessToken } from "../../helpers/handleJWT.js";

export default class AuthService {
  #userRepository;

  constructor({ userRepository }) {
    this.#userRepository = userRepository;
  }

  async register({ fullName, nickname, email, password, country }) {
    // check if user already exists
    if (
      (await this.#userRepository.getUserByEmail(email)) ||
      (await this.#userRepository.getUserByNickname(nickname))
    ) {
      throw new AppError("User already exists", 400);
    }

    const passwordHash = await bycript.hash(password, 10);

    const newUser = await this.#userRepository.createUserWithDetails({
      fullName,
      email,
      password: passwordHash,
      nickname,
      country,
    });

    const token = createAccessToken(newUser);

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
    // 1 - val if user is registered
    const user =
      await this.#userRepository.getUserByNicknameOrEmail(userNicknameOrEmail);

    if (!user) {
      throw new AppError("userNickname or password is incorrect", 400);
    }
    // 2 - val if user is active
    else if (!user.statusu) {
      throw new AppError("user is not active", 400);
    }
    // 3 - val password is correct
    const validPassword = await bycript.compare(userPassword, user.passwordu);

    if (!validPassword) {
      throw new AppError("userNickname or password is incorrect", 400);
    }

    // 4 - the create access token
    const token = createAccessToken(user);

    // 5 - return the user and access token
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
