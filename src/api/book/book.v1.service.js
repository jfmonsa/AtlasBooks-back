import { NotFoundError, ForbiddenError } from "../../helpers/exeptions.js";
import { ROLES } from "../../helpers/roles.js";

export default class BookService {
  #bookRepository;
  #bookRateRepository;
  #bookCommentsRepository;
  #bookCategoriesRepository;
  #bookFilesRepository;
  #bookAuthorsRepository;
  #bookLanguagesRepository;
  #userRepository;

  constructor({
    bookRepository,
    bookRateRepository,
    bookCommentsRepository,
    bookCategoriesRepository,
    bookFilesRepository,
    bookAuthorsRepository,
    bookLanguagesRepository,
    userRepository,
  }) {
    this.#bookRepository = bookRepository;
    this.#bookRateRepository = bookRateRepository;
    this.#bookCommentsRepository = bookCommentsRepository;
    this.#bookCategoriesRepository = bookCategoriesRepository;
    this.#bookFilesRepository = bookFilesRepository;
    this.#bookAuthorsRepository = bookAuthorsRepository;
    this.#bookLanguagesRepository = bookLanguagesRepository;
    this.#userRepository = userRepository;
  }

  /**
   * Retrieves a book with its details.
   * @param {string} id - The ID of the book.
   * @returns {Promise<Object>} The book with its details.
   */
  async getBookWithDetails(id) {
    const book = await this.verifyBookExists(id);

    const NUMBER_OF_RELATED_BOOKS = 10;

    const [authors, languages, files, rate, subcategories, comments] =
      await Promise.all([
        this.#bookAuthorsRepository.getBookAuthors(id),
        this.#bookLanguagesRepository.getBookLanguages(id),
        this.#bookFilesRepository.getBookFileNames(id),
        this.#bookRateRepository.getAVGBookRate(id),
        this.#bookCategoriesRepository.getBookCategories(id),
        this.#bookCommentsRepository.getBookComments(id),
      ]);

    const [fileExtensions, relatedBooks] = await Promise.all([
      this.#bookFilesRepository.getBookFileTypes(files),
      this.#getBookRelatedBooks(
        id,
        subcategories.subcategoriesIds,
        subcategories.categoryId,
        NUMBER_OF_RELATED_BOOKS
      ),
    ]);

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

    // format data and remove duplicate authors
    return relatedBooks.map(book => {
      const uniqueAuthors = Array.from(new Set(book.authors));
      return {
        authors: uniqueAuthors.join(", "),
        title: book.title,
        pathBookCover: book.coverImgPath,
        bookId: book.id,
      };
    });
  }

  async create(bookData, userId) {
    await this.#bookRepository.createBookWithDetails(bookData);
    await this.checkAndUpdateUserRole(userId);
  }

  /**
   * Checks if the user has uploaded 5 books and updates their role to premium.
   * @param {string} userId - The ID of the user.
   */
  async checkAndUpdateUserRole(userId) {
    const uploadedBooksCount =
      await this.#bookRepository.countBooksUploadedByUser(userId);
    const currentUserRole = await this.#userRepository.getUserRole(userId);

    if (
      currentUserRole === ROLES.USER_PREMIUM ||
      currentUserRole === ROLES.ADMIN
    )
      return;
    if (uploadedBooksCount >= 5) {
      await this.#userRepository.updateUserRole(userId, ROLES.USER_PREMIUM);
    }
  }

  async downloadBook(userId, bookId, fileName) {
    await this.verifyBookExists(bookId);

    const userRole = await this.#userRepository.getUserRole(userId);

    // Check if the user has reached the daily download limit
    if (userRole !== ROLES.USER_PREMIUM) {
      const dailyDownloads =
        await this.#bookRepository.countDailyDownloadsByUser(userId);
      if (dailyDownloads >= 5) {
        throw new ForbiddenError(
          "You have reached the daily download limit for non-premium users."
        );
      }
    }

    const fileCloudUrl = await this.#bookFilesRepository.getFileCloudUrl(
      fileName,
      bookId
    );

    // TODO: review this, reading cloudinary docs
    // -> by commenting this we are trusting that the file exists in cloudinary from urls
    //    stored in the database
    // try {
    //   await this.#bookFilesRepository.verifyFileExistsInCloudinary(
    //     fileCloudUrl
    //   );
    // } catch {
    //   throw new NotFoundError(
    //     "File not found, try downloading it manually:" + fileCloudUrl
    //   );
    // }

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
