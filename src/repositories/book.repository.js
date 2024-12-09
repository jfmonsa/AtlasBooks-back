import BaseRepository from "./base.repository.js";

export default class BookRepository extends BaseRepository {
  #bookFilesRepository;
  #bookCategoriesRepository;
  #bookAuthorsRepository;
  #bookLanguagesRepository;

  constructor({
    bookFilesRepository,
    bookCategoriesRepository,
    bookAuthorsRepository,
    bookLanguagesRepository,
  }) {
    super("book");
    this.#bookFilesRepository = bookFilesRepository;
    this.#bookCategoriesRepository = bookCategoriesRepository;
    this.#bookAuthorsRepository = bookAuthorsRepository;
    this.#bookLanguagesRepository = bookLanguagesRepository;
  }

  async getById(id) {
    return await super.findById(id);
  }

  // for related books
  async getRelatedBooksBySubcategory(idBook, subcategoryIds) {
    if (!subcategoryIds) return [];

    const query = `
      SELECT b.id, b.title, b.cover_img_path, array_agg(DISTINCT ba.author) AS authors 
      FROM BOOK b
      INNER JOIN BOOK_IN_SUBCATEGORY bis ON b.id = bis.id_book
      INNER JOIN BOOK_AUTHORS ba ON b.id = ba.id_book
      WHERE bis.id_subcategory = ANY($1) AND b.id != $2
      GROUP BY b.id
      LIMIT 20
    `;
    return await super.executeQuery(query, [subcategoryIds, idBook]);
  }

  async getRelatedBooksByCategory(idBook, categoryId, limit) {
    if (!categoryId) return [];
    const query = `
      SELECT b.id, b.title, b.cover_img_path, array_agg(DISTINCT ba.author) AS authors
      FROM BOOK b
      INNER JOIN BOOK_IN_SUBCATEGORY bis ON b.id = bis.id_book
      INNER JOIN BOOK_AUTHORS ba ON b.id = ba.id_book
      WHERE bis.id_subcategory IN (
        SELECT id FROM SUBCATEGORY WHERE id_category_father = $1
      ) AND b.id != $2
      GROUP BY b.id
      LIMIT $3
    `;
    return await super.executeQuery(query, [categoryId, idBook, limit]);
  }

  async getRelatedBooksRandomly(idBook, limit) {
    const query = `
      SELECT b.id, b.title, b.cover_img_path, array_agg(DISTINCT ba.author) AS authors
      FROM BOOK b
      INNER JOIN BOOK_AUTHORS ba ON b.id = ba.id_book
      WHERE b.id != $1
      GROUP BY b.id
      ORDER BY RANDOM()
      LIMIT $2
    `;
    return await super.executeQuery(query, [idBook, limit]);
  }

  // for book creation
  async createBookWithDetails(bookData) {
    const {
      authors,
      languages,
      subcategoryIds,
      bookFiles,
      coverBookFile,
      userIdWhoUploadBook,
      ...bookDetails
    } = bookData;

    await super.transaction(async client => {
      const coverUrl =
        await this.#bookFilesRepository.uploadCoverImage(coverBookFile);
      const { id: bookId } = await super.create(
        { ...bookDetails, coverImgPath: coverUrl },
        client
      );
      await this.#bookFilesRepository.registerBookUpload(
        userIdWhoUploadBook,
        bookId,
        client
      );
      await this.#bookFilesRepository.uploadAndInsertBookFiles(
        bookId,
        bookFiles,
        bookDetails.title,
        client
      );

      // Remove duplicate authors
      const uniqueAuthors = Array.from(new Set(authors));
      await this.#bookAuthorsRepository.insertBookAuthors(
        bookId,
        uniqueAuthors,
        client
      );

      await this.#bookLanguagesRepository.insertBookLanguages(
        bookId,
        languages,
        client
      );
      await this.#bookCategoriesRepository.insertBookSubcategories(
        bookId,
        subcategoryIds,
        client
      );
    });
  }
}
