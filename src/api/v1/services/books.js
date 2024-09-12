// for getBookWithDetails
import {
  getBookById,
  getBookAuthors,
  getBookLanguages,
  getBookFileNames,
  getBookFileTypes,
  getBookRate,
  getBookSubcategories,
} from "../repositories/BookDetailsRepository.js";

import { getBookComments } from "../repositories/BookCommentsRepository.js";

// for getRelatedBooks
import {
  getRelatedBooksBySubcategory,
  getRelatedBooksByCategory,
  getRandomBooks,
} from "../repositories/BookRelatedBooksRepository.js";

// for createBook
import {
  uploadCoverImage,
  insertBookRecord,
  uploadAndInsertBookFiles,
  insertBookAuthors,
  insertBookLanguages,
  insertBookSubcategories,
} from "../repositories/BookCreateRepository.js";
import { withTransaction } from "../../../utils/withTransaction.js";

// for downloadBook
import {
  getFileInfo,
  verifyFileExistsInCloudinary,
  registerDownload,
} from "../repositories/BookDownloadRepository.js";

// for rateBook
import {
  getRate,
  updateRate,
  insertRate,
  getRateOfBookByUserId,
} from "../repositories/BookRateRepository.js";

export class BookService {
  /**
   * Retrieves a book with its details.
   *
   * @param {string} id - The ID of the book.
   * @returns {Promise<Object>} The book with its details.
   */
  static async getBookWithDetails(id) {
    // validate that book exits
    const book = await getBookById(id);
    if (!book) return null;

    // return data
    // TODO: Aquí falta usar getBookFileTypes
    const [authors, languages, files, rate, subcategories, comments] =
      await Promise.all([
        getBookAuthors(id),
        getBookLanguages(id),
        getBookFileNames(id),
        getBookRate(id),
        getBookSubcategories(id),
        getBookComments(id),
      ]);

    const relatedBooks = await this.getBookRelatedBooks(
      id,
      subcategories.subcategoryIds,
      subcategories.categoryId
    );

    return {
      ...book,
      authors,
      languages,
      files,
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
  // TODO: modificar para que use solo el id del libro
  static async getBookRelatedBooks(
    idBook,
    subcategoryIds,
    categoryId,
    numberOfBooks
  ) {
    // get data
    let relatedBooks = await getRelatedBooksBySubcategory(
      idBook,
      subcategoryIds
    );

    if (relatedBooks.length < numberOfBooks) {
      const additionalBooks = await getRelatedBooksByCategory(
        idBook,
        categoryId,
        relatedBooks.length - numberOfBooks
      );
      relatedBooks.concat(additionalBooks);
    }

    if (relatedBooks.length < numberOfBooks) {
      const randomBooks = await getRandomBooks(
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

  /**
   * Creates a new book (in db) with the provided book data.
   *
   * @param {Object} bookData - The data of the book to be created.
   * @param {Object} req - The request object containing the book cover and files.
   * @returns {Promise<void>} - A promise that resolves when the book is created.
   */
  static async createBook(bookData, req) {
    const coverUrl = await uploadCoverImage(req.files.cover);
    console.log(coverUrl);

    await withTransaction(async client => {
      const bookId = await insertBookRecord(client, { ...bookData, coverUrl });
      await uploadAndInsertBookFiles(client, bookId, req.files.bookFiles);
      await insertBookAuthors(client, bookId, bookData.authors);
      await insertBookLanguages(client, bookId, bookData.languages);
      await insertBookSubcategories(client, bookId, bookData.subcategoryIds);
    });
  }

  static async downloadBook(bookId, userId) {
    const fileInfo = await getFileInfo(fileId, bookId);
    await verifyFileExistsInCloudinary(fileInfo.pathF);
    await registerDownload(userId, bookId);
    await streamFileToClient(res, fileInfo);
  }

  static async rateBook(userId, bookId, rate) {
    //Validate if the user has already rated the book
    const rated = await getRate(userId, bookId);
    //If the user has already rated the book -> update the rate
    if (rated) {
      await updateRate(userId, bookId, rate);
    } else {
      //If the user has not rated the book -> insert the rate
      await insertRate(userId, bookId, rate);
    }
  }

  static async getRateOfBookByUserId(userId, bookId) {
    return await getRate(userId, bookId);
  }
}
