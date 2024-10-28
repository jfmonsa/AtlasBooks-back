import BaseRepository from "./base.repository.js";
import cloudinary from "../config/cloudinary.js";

export default class BookFilesRepository extends BaseRepository {
  constructor() {
    super("BOOK_FILES");
  }

  async getFileCloudUrl(fileName, bookId) {
    const result = await super.executeQuery(
      `SELECT file_path FROM ${this.tableName} WHERE original_name = $1 AND id_book = $2`,
      [fileName, bookId]
    );
    return result.length > 0 ? result[0].filePath : null;
  }

  async verifyFileExistsInCloudinary(cloudinaryUrl) {
    const publicId = cloudinaryUrl
      .split("/")
      .slice(-2) // get last two elements (folder/file)
      .join("/") // join last two elements (folder/file)
      .split(".")[0]; // remove file extention

    await cloudinary.api.resource(publicId);
  }

  async registerDownload(userId, bookId) {
    await super.executeQuery(
      `INSERT INTO BOOK_DOWNLOAD (id_user, id_book, date_downloaded) 
       VALUES ($1, $2, NOW()) 
       ON CONFLICT (id_user, id_book) 
       DO UPDATE SET date_downloaded = EXCLUDED.date_downloaded`,
      [userId, bookId]
    );
  }
}
