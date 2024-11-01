import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../helpers/exeptions.js";

export default class BookListsService {
  #bookListsRepository;
  #bookService;

  constructor({ bookListsRepository, bookService }) {
    this.#bookListsRepository = bookListsRepository;
    this.#bookService = bookService;
  }

  async createList(listData) {
    const list = await this.#bookListsRepository.listOfUserWithSameTitleExists(
      listData.title,
      listData.idUser
    );
    if (list) {
      throw new ConflictError("List with same title already exists");
    }
    return await this.#bookListsRepository.createList(listData);
  }

  async getListById(id, userId) {
    const list = await this.#bookListsRepository.findById(id);

    if (!list) {
      throw new NotFoundError("List not found");
    }

    if (!list.isPublic && list.idUser !== userId) {
      throw new ForbiddenError("You can't access this list");
    }

    return {
      ...list,
      books: await this.#bookListsRepository.getBookDetailsOfList(id),
    };
  }

  async getListsWhereBookIs(bookId, userId) {
    await this.#bookService.verifyBookExists(bookId);
    return await this.#bookListsRepository.getListsWhereBookIs(bookId, userId);
  }

  async addBookToList({ bookId, userId, listId }) {
    await this.#bookService.verifyBookExists(bookId);
    await this.#validateListOwnership(listId, userId);

    await this.#bookListsRepository.addBookToList(bookId, listId);
  }

  async removeBookFromList({ bookId, userId, listId }) {
    await this.#bookService.verifyBookExists(bookId);
    await this.#validateListOwnership(listId, userId);

    await this.#bookListsRepository.removeBookFromList(bookId, listId);
  }

  async getUserLists(userId) {
    return await this.#bookListsRepository.getUserLists(userId);
  }

  async #validateListOwnership(listId, userId) {
    const list = await this.#bookListsRepository.findById(listId);

    if (!list) {
      throw new NotFoundError("List not found");
    }

    if (list.idUser !== userId) {
      throw new ForbiddenError("User not authorized to access this list");
    }
  }
}
