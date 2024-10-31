import { ROLES } from "../helpers/roles.js";
import BaseRepository from "./base.repository.js";
import { DEFAULT_PROFILE_PIC } from "../config/cloudinary.js";

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
    const newUser = await super.create(
      {
        ...userData,
        registerDate: "NOW()",
        isActive: true,
        role: ROLES.USER_BASIC,
        profileImgPath: DEFAULT_PROFILE_PIC,
      },
      client
    );
    return newUser;
  }

  // insert data with transaction (safety for multiple insertions)
  async createUserWithDetails(userData) {
    let newUser;
    await super.transaction(async client => {
      newUser = await this.createUser(userData, client);
      await this.#bookListRepository.createDefaultList(newUser.id, client);
    });
    return newUser;
  }

  async getUserById(userId) {
    return await super.findById(userId);
  }

  async updateUserPassword(userId, password) {
    return await super.update(userId, { password });
  }

  async deleteUser(userId) {
    return await super.update(userId, { isActive: false });
  }

  async getDownloadHistory(userId) {
    const query = `
    SELECT 
        dh.id_user,
        dh.date_downloaded,
        b.id AS book_id,
        b.isbn,
        b.title,
        b.description,
        b.year_released,
        b.volume,
        b.number_of_pages,
        b.publisher,
        b.cover_img_path,
        a.author
    FROM 
       book_download dh
    JOIN 
        book b ON dh.id_book = b.id
    JOIN 
        book_authors a ON b.id = a.id_book
    WHERE 
        dh.id_user = $1
    ORDER BY 
        dh.date_downloaded DESC;`;
    const downloads = await super.executeQuery(query, [userId]);
    return downloads;
  }
}
