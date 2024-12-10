import { ROLES } from "../helpers/roles.js";
import BaseRepository from "./base.repository.js";
import { DEFAULT_PROFILE_PIC } from "../config/cloudinary.js";

/** Represents a repository for interacting with the users table. */
export default class UserRepository extends BaseRepository {
  #bookListsRepository;

  constructor({ bookListsRepository }) {
    super("users");
    this.#bookListsRepository = bookListsRepository;
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
      await this.#bookListsRepository.createDefaultList(newUser.id, client);
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

  async banUser(userId, adminWhoBannedId) {
    await this.executeQuery(
      `INSERT INTO user_ban 
        (id_user_banned, id_admin_who_banned, motivation, date_banned_at)
        VALUES ($1, $2, $3, $4)`,

      [userId, adminWhoBannedId, "No Reason", "NOW()"]
    );

    return await super.update(userId, { isActive: false });
  }

  async unbanUser(userId) {
    await this.executeQuery(`DELETE FROM user_ban WHERE id_user_banned = $1`, [
      userId,
    ]);

    return await super.update(userId, { isActive: true });
  }

  async changeEmail(userId, newEmail) {
    return await super.update(userId, { email: newEmail });
  }

  async updateUserEmail(idUser, newEmail) {
    await super.update(idUser, { email: newEmail });
  }

  async updateUserRole(userId, newRole) {
    return await super.update(userId, { role: newRole });
  }

  async getUserRole(userId) {
    const result = await super.executeQuery(
      `SELECT role FROM users WHERE id = $1`,
      [userId]
    );
    return result[0]?.role;
  }

  async registerBookDownload(userId, bookId) {
    const query = `
      INSERT INTO BOOK_DOWNLOAD (id_user, id_book, date_downloaded)
      VALUES ($1, $2, NOW())
    `;
    await super.executeQuery(query, [userId, bookId]);
  }
}
