import { NotFoundError, ValidationError } from "../../helpers/exeptions.js";

export default class BookService {
  #bookRepository;
  #bookRateRepository;
  #bookCommentsRepository;
  #bookCategoriesRepository;
  #bookFilesRepository;

  constructor({
    bookRepository,
    bookRateRepository,
    bookCommentsRepository,
    bookCategoriesRepository,
    bookFilesRepository,
  }) {
    this.#bookRepository = bookRepository;
    this.#bookRateRepository = bookRateRepository;
    this.#bookCommentsRepository = bookCommentsRepository;
    this.#bookCategoriesRepository = bookCategoriesRepository;
    this.#bookFilesRepository = bookFilesRepository;
  }

  /**
   * Retrieves a book with its details.
   *
   * @param {string} id - The ID of the book.
   * @returns {Promise<Object>} The book with its details.
   */
  async getBookWithDetails(id) {
    const book = await this.#bookRepository.getById(id);

    // check if book exists
    if (!book) return null;

    const [authors, languages, files, rate, subcategories, comments] =
      await Promise.all([
        this.#bookRepository.getBookAuthors(id),
        this.#bookRepository.getBookLanguages(id),
        this.#bookRepository.getBookFileNames(id),
        this.#bookRateRepository.getAVGBookRate(id),
        this.#bookCategoriesRepository.getBookCategories(id),
        this.#bookCommentsRepository.getBookComments(id),
      ]);
    const fileExtensions = await this.#bookRepository.getBookFileTypes(files);

    const relatedBooks = await this.#getBookRelatedBooks(
      id,
      subcategories.subcategoryIds,
      subcategories.categoryId
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
          relatedBooks.length - numberOfBooks
        );
      relatedBooks.concat(additionalBooks);
    }

    if (relatedBooks.length < numberOfBooks) {
      const randomBooks = await this.#bookRepository.getRelatedBooksRandomly(
        idBook,
        relatedBooks.length - numberOfBooks
      );
      relatedBooks.concat(randomBooks);
    }

    // format data
    return relatedBooks.map(book => ({
      authors: book.authors.join(", "),
      title: book.title,
      pathBookCover: book.pathbookcover,
      bookId: book.id,
    }));
  }

  async create(bookData) {
    // extra validations
    if (!bookData.authors || bookData.authors.length === 0) {
      throw new ValidationError("There should be at least one author");
    }
    if (!bookData.languages || bookData.languages.length === 0) {
      throw new ValidationError("There should be at least one language");
    }
    if (!bookData.subcategoryIds || bookData.subcategoryIds.length === 0) {
      throw new ValidationError("There should be at least one subcategory");
    }

    await this.#bookRepository.createBookWithDetails(bookData);
  }

  async downloadBook(userId, bookId, fileName) {
    const fileCloudUrl = await this.#bookFilesRepository.getFileCloudUrl(
      fileName,
      bookId
    );
    if (!fileCloudUrl) {
      throw new NotFoundError("File not exits");
    }

    try {
      await this.#bookFilesRepository.verifyFileExistsInCloudinary(
        fileCloudUrl
      );
    } catch (err) {
      console.log(err);
      throw new ValidationError("File not exists");
    }

    await this.#bookFilesRepository.registerDownload(userId, bookId);
    return fileCloudUrl;
  }

  async rate(userId, bookId, rate) {
    await this.#bookRateRepository.upsertRate(bookId, userId, rate);
  }

  async getRateOfBookByUserId(bookId, userId) {
    return await this.#bookRateRepository.getBookRateByUser(userId, bookId);
  }
}
