import BaseRepository from "./base.repository.js";

/** Represents a repository for interacting with the users table. */
export default class UserRepository extends BaseRepository {
  #bookListRepository;

  constructor({ bookListRepository }) {
    super("users");
    this.#bookListRepository = bookListRepository;
  }

  async getUserByEmail(email) {
    const result = await super.findWhere({ email });
    return result?.[0] || null;
  }

  async getUserByNickname(nickname) {
    const result = await super.findWhere({ nickname });
    return result?.[0] || null;
  }

  async getUserByNicknameOrEmail(emailOrNickname) {
    const result = await super.executeQuery(
      `SELECT * FROM users WHERE email = $1 or nickname = $1`,
      [emailOrNickname]
    );
    return result?.[0] || null;
  }

  async createUser(userData, client) {
    console.log("inicio de createUser");
    const newUser = await super.create(
      {
        ...userData,
        registerDate: "NOW()",
        isActive: true,
        isAdmin: false,
        profileImgPath: "../storage/usersProfilePic/default.webp",
      },
      client
    );
    console.log("New user created:", newUser);
    delete newUser.password;
    return newUser;
  }

  // insert data with transaction (safety for multiple insertions)
  async createUserWithDetails(userData) {
    console.log("inicio de createUserWithDetails");
    let newUser;
    await super.transaction(async client => {
      newUser = await this.createUser(userData, client);
      await this.#bookListRepository.createDefaultList(newUser.id, client);
    });
    return newUser;
  }
}
