import { getUserByNicknameOrEmail } from "../repositories/loginRepository";
import {
  getUserByEmail,
  getUserByNickname,
  createAndGetUser,
  createDefaultBookList,
  getUserById,
} from "../repositories/registerRepository";
import { withTransaction } from "../../../utils/withTransaction";
import { CustomError } from "../../middlewares/errorMiddleware";
import bycript from "bcryptjs";
import { createAccessToken } from "../../../utils/handleJWT";

export class AuthService {
  /**
   * Authenticates a user by their nickname or email and password.
   *
   * @param {string} userNicknameOrEmail - The nickname or email of the user.
   * @param {string} userPassword - The password of the user.
   * @returns {Promise<Object>} - A promise that resolves to an object containing the authenticated user and access token.
   * @throws {CustomError} - Throws a custom error if the user is not registered, not active, or if the password is incorrect.
   */
  static async login(userNicknameOrEmail, userPassword) {
    // 1 - val if user is registered
    user = getUserByNicknameOrEmail(userNicknameOrEmail);

    if (!user) {
      throw new CustomError("userNickname or password is incorrect", 400);
    }
    // 2 - val if user is active
    else if (!user.statusu) {
      throw new CustomError("user is not active", 400);
    }
    // 3 - val password is correct
    const validPassword = await bycript.compare(userPassword, user.passwordu);

    if (!validPassword) {
      throw new CustomError("userNickname or password is incorrect", 400);
    }

    // 4 - the create access token
    const token = createAccessToken(user);

    // 5 - return the user and access token
    return {
      user,
      token,
    };
  }

  /**
   * Registers a new user.
   *
   * @param {string} name - The name of the user.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @param {string} nickName - The nickname of the user.
   * @param {string} country - The country of the user.
   * @returns {Object} - An object containing the newly registered user and the access token.
   * @throws {CustomError} - If the user already exists.
   */
  static async register(name, email, password, nickName, country) {
    // 1 - check if the user is already registered
    if (getUserByEmail(email) || getUserByNickname(nickName)) {
      throw new CustomError("User already exists", 400);
    }

    // 2 - insert data with transaction (safety for multiple insertions)
    let newUser = null;
    await withTransaction(async client => {
      const passwordHash = await bcrypt.hash(password, 10);
      newUser = await createAndGetUser(
        client,
        name,
        email,
        passwordHash,
        nickName,
        country
      );
      await createDefaultBookList(client, user.id);
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

  static async verifyToken(token) {
    // 1 - val if token is valid
    const dataToken = await tokenVerify(token);

    if (!dataToken?.id) {
      throw new CustomError("Invalid token", 400);
    }

    // 3 - val if user exists
    const user = getUserById(dataToken.id);

    if (!user) {
      throw new CustomError("User not found", 400);
    }

    // 4 - val if user is active
    if (!user.statusu) {
      throw new CustomError("User is not active", 400);
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
      throw new CustomError("Invalid token", 400);
    }

    // 3 - val if user exists
    const user = getUserById(dataToken.id);

    if (!user) {
      throw new CustomError("User not found", 400);
    }

    // 4 - val if user is active
    if (!user.statusu) {
      throw new CustomError("User is not active", 400);
    }

    // don't return the password :)
    delete user.passwordu;

    // 5 - return user
    return user;
  }
}
