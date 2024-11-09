import { NotFoundError } from "../../helpers/exeptions.js";

export default class BookService {
  #bookRepository;
  #bookRateRepository;
  #bookCommentsRepository;
  #bookCategoriesRepository;
  #bookFilesRepository;
  #bookAuthorsRepository;
  #bookLanguagesRepository;

  constructor({
    bookRepository,
    bookRateRepository,
    bookCommentsRepository,
    bookCategoriesRepository,
    bookFilesRepository,
    bookAuthorsRepository,
    bookLanguagesRepository,
  }) {
    this.#bookRepository = bookRepository;
    this.#bookRateRepository = bookRateRepository;
    this.#bookCommentsRepository = bookCommentsRepository;
    this.#bookCategoriesRepository = bookCategoriesRepository;
    this.#bookFilesRepository = bookFilesRepository;
    this.#bookAuthorsRepository = bookAuthorsRepository;
    this.#bookLanguagesRepository = bookLanguagesRepository;
  }

  /**
   * Retrieves a book with its details.
   * @param {string} id - The ID of the book.
   * @returns {Promise<Object>} The book with its details.
   */
  async getBookWithDetails(id) {
    await this.verifyBookExists(id);

    const book = await this.#bookRepository.getById(id);

    const [authors, languages, files, rate, subcategories, comments] =
      await Promise.all([
        this.#bookAuthorsRepository.getBookAuthors(id),
        this.#bookLanguagesRepository.getBookLanguages(id),
        this.#bookFilesRepository.getBookFileNames(id),
        this.#bookRateRepository.getAVGBookRate(id),
        this.#bookCategoriesRepository.getBookCategories(id),
        this.#bookCommentsRepository.getBookComments(id),
      ]);
    const fileExtensions =
      await this.#bookFilesRepository.getBookFileTypes(files);

    const relatedBooks = await this.#getBookRelatedBooks(
      id,
      subcategories.subcategoriesIds,
      subcategories.categoryId,
      10
    );

    return {
      ...book,
      authors,
      languages,
      files,
      fileExtensions,
      rate,
      subcategories,
      relatedBooks,
      comments,
    };
  }

  /**
   * Retrieves related books based on given parameters based on priority:
   *  1. Related books by subcategory
   *  2. Related books by category
   *  3. Random books
   *
   * @param {string} idBook - The ID of the book.
   * @param {Array<string>} subcategoryIds - The IDs of the subcategories.
   * @param {string} categoryId - The ID of the category.
   * @returns {Promise<Array>} The array of related books.
   */
  async #getBookRelatedBooks(
    idBook,
    subcategoryIds,
    categoryId,
    numberOfBooks
  ) {
    // get data
    let relatedBooks = await this.#bookRepository.getRelatedBooksBySubcategory(
      idBook,
      subcategoryIds
    );

    if (relatedBooks.length < numberOfBooks) {
      const additionalBooks =
        await this.#bookRepository.getRelatedBooksByCategory(
          idBook,
          categoryId,
          numberOfBooks - relatedBooks.length
        );
      relatedBooks = relatedBooks.concat(additionalBooks);
    }

    if (relatedBooks.length < numberOfBooks) {
      const randomBooks = await this.#bookRepository.getRelatedBooksRandomly(
        idBook,
        numberOfBooks - relatedBooks.length
      );
      relatedBooks = relatedBooks.concat(randomBooks);
    }

    // format data
    return relatedBooks.map(book => ({
      authors: book.authors.join(", "),
      title: book.title,
      pathBookCover: book.coverImgPath,
      bookId: book.id,
    }));
  }

  async create(bookData) {
    await this.#bookRepository.createBookWithDetails(bookData);
  }

  async downloadBook(userId, bookId, fileName) {
    await this.verifyBookExists(bookId);

    const fileCloudUrl = await this.#bookFilesRepository.getFileCloudUrl(
      fileName,
      bookId
    );

    try {
      await this.#bookFilesRepository.verifyFileExistsInCloudinary(
        fileCloudUrl
      );
    } catch {
      throw new NotFoundError(
        `Error descargando el enlace, vaya manualmente a ${fileCloudUrl}`
      );
    }

    await this.#bookFilesRepository.registerDownload(userId, bookId);
    return fileCloudUrl;
  }

  async rate(userId, bookId, rate) {
    await this.verifyBookExists(bookId);
    await this.#bookRateRepository.upsertRate(bookId, userId, rate);
  }

  async getRateOfBookByUserId(userId, bookId) {
    await this.verifyBookExists(bookId);
    return await this.#bookRateRepository.getBookRateByUser(userId, bookId);
  }

  /**
   * Verifies if a book exists in the repository by its ID.
   *
   * @param {string} bookId - The ID of the book to verify.
   * @returns {Promise<Object>} - The book object if found.
   * @throws {NotFoundError} - If the book is not found.
   */
  async verifyBookExists(bookId) {
    const book = await this.#bookRepository.getById(bookId);
    if (!book) {
      throw new NotFoundError("Book not found");
    }
    return book;
  }
}
