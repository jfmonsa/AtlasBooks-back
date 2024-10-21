import { getUserByNicknameOrEmail } from "./repositories/login.repository.js";
import {
  getUserByEmail,
  getUserByNickname,
  createAndGetUser,
  createDefaultBookList,
} from "./repositories/register.repository.js";
import { withTransaction } from "../../helpers/withTransaction.js";
import { AppError } from "../../helpers/exeptions.js";
import bycript from "bcryptjs";
import { createAccessToken } from "../../helpers/handleJWT.js";

export class AuthService {
  /**
   * Registers a new user.
   *
   * @param {string} name - The name of the user.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @param {string} nickName - The nickname of the user.
   * @param {string} country - The country of the user.
   * @returns {Object} - An object containing the newly registered user and the access token.
   * @throws {AppError} - If the user already exists.
   */
  static async register(name, email, password, nickName, country) {
    // 1 - check if the user is already registered

    if ((await getUserByEmail(email)) || (await getUserByNickname(nickName))) {
      throw new AppError("User already exists", 400);
    }

    // 2 - insert data with transaction (safety for multiple insertions)
    let newUser = null;
    const passwordHash = await bycript.hash(password, 10);

    await withTransaction(async client => {
      newUser = await createAndGetUser(
        client,
        name,
        email,
        passwordHash,
        nickName,
        country
      );
      await createDefaultBookList(client, newUser.id);
    });

    // don't return the password
    delete newUser.passwordu;

    // 3 - return new user
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
  static async login(userNicknameOrEmail, userPassword) {
    // 1 - val if user is registered
    const user = await getUserByNicknameOrEmail(userNicknameOrEmail);

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

  static async verifyToken(token) {
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
  static async verifyEmail(token) {
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
