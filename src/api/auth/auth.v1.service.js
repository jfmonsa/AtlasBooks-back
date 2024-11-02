import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../helpers/exeptions.js";
import bcrypt from "bcryptjs";
import sendEmail from "../../helpers/sendEmail.js";

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
    const token = this.#createAccessToken(newUser, { expiresIn: "2h" });

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
      throw new ForbiddenError("user is not active");
    }

    const isValidPassword = await bcrypt.compare(userPassword, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError("nickname, email or password is incorrect");
    }

    delete user.password;
    const token = this.#createAccessToken(user, { expiresIn: "2h" });

    return {
      user,
      token,
    };
  }

  async verifyToken(token) {
    const user = await this.#verifyTokenDep(token);

    // TODO: implement refresh + access token strategy
    // @see https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js/
    if (!user.isActive) {
      throw new ForbiddenError("User is not active or banned");
    }

    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.#userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundError("User not exists");
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

  async changeEmail(userData, newEmail) {
    const userWithSameEmailExists =
      await this.#userRepository.getUserByEmail(newEmail);

    if (userWithSameEmailExists) {
      throw new ConflictError("Email already in use");
    }

    // in order to be able to create the token, we need to remove the exp and iat properties
    delete userData.exp;
    delete userData.iat;

    const tokenEmail = this.#createAccessToken(
      { ...userData, newEmail },
      { expiresIn: "20m" },
      process.env.JWT_SECRET_FOR_LINKS
    );

    const urlConfirmEmailChange = `${process.env.FRONTEND_URL}/received-email/${tokenEmail}`;

    const emailHtmlContent = `
      <h1>Cambio de Correo Electronico - AtlasBooks</h1>
      <p>Para continuar con el proceso de cambio de correo electronico presione el sieguiente enlace:
      <a href=${urlConfirmEmailChange}">Confirmar email</a></p>

      <p>O copie y pegue el siguiente enlace en su navegador: ${urlConfirmEmailChange}</p>
      `;

    await sendEmail({
      toEmail: newEmail,
      subject: "Cambio de Correo Electronico - AtlasBooks",
      htmlContent: emailHtmlContent,
    });
  }

  async changeEmailConfirmed(token) {
    const userData = await this.#verifyTokenDep(
      token,
      process.env.JWT_SECRET_FOR_LINKS
    );

    await this.#userRepository.updateUserEmail(userData.id, userData.newEmail);
  }

  async forgotPassword(email) {
    const user = await this.#userRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError("Correo electronico incorrecto");
    }

    const token = this.#createAccessToken(
      user,
      { expiresIn: "20m" },
      process.env.JWT_SECRET_FOR_LINKS
    );

    const urlResetPassword = `${process.env.FRONTEND_URL}/newPassword/${token}`;

    const emailHtmlContent = `
      <h1>Restablecer Contraseña - AtlasBooks</h1>
      <p>Para restablecer su contraseña presione el siguiente enlace:
      <a href=${urlResetPassword}">Restablecer contraseña</a></p>
      <p> O copie y pegue el siguiente enlace en su navegador: ${urlResetPassword}
      </p>
    `;

    await sendEmail({
      toEmail: email,
      subject: "Restablecer Contraseña - AtlasBooks",
      htmlContent: emailHtmlContent,
    });
  }

  async forgotPasswordEmailConfirmed(newPassword, token) {
    const userData = await this.#verifyTokenDep(
      token,
      process.env.JWT_SECRET_FOR_LINKS
    );

    const newPasswordHashed = await this.#hashPassword(newPassword);

    await this.#userRepository.updateUserPassword(
      userData.id,
      newPasswordHashed
    );
  }
}
