import { HTTP_CODES } from "../../helpers/httpCodes.js";

export default class BookListsController {
  #bookListsService;

  constructor({ bookListsService }) {
    this.#bookListsService = bookListsService;

    this.createBookList = this.createBookList.bind(this);
    this.getListById = this.getListById.bind(this);
    this.getListsWhereBookIs = this.getListsWhereBookIs.bind(this);
    this.addBookToList = this.addBookToList.bind(this);
    this.removeBookFromList = this.removeBookFromList.bind(this);
    this.getUserLists = this.getUserLists.bind(this);
  }

  async createBookList(req, res) {
    const idUser = req.user.id;

    const list = await this.#bookListsService.createList({
      ...req.body,
      idUser,
    });
    res.formatResponse({ listId: list.id }, "List created", HTTP_CODES.CREATED);
  }

  async getListById(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    const list = await this.#bookListsService.getListById(id, userId);

    res.formatResponse(list);
  }

  async getListsWhereBookIs(req, res) {
    const { bookId } = req.params;
    const userId = req.user.id;

    const lists = await this.#bookListsService.getListsWhereBookIs(
      bookId,
      userId
    );

    res.formatResponse(lists);
  }

  async addBookToList(req, res) {
    const { bookId, listId } = req.body;
    const userId = req.user.id;

    await this.#bookListsService.addBookToList({ bookId, userId, listId });

    res.formatResponse(
      {},
      "Book added to list successfully",
      HTTP_CODES.CREATED
    );
  }

  async removeBookFromList(req, res) {
    const { bookId, listId } = req.body;
    const userId = req.user.id;

    await this.#bookListsService.removeBookFromList({ bookId, userId, listId });

    res.formatResponse({}, "Book removed from list successfully");
  }

  async getUserLists(req, res) {
    const userId = req.user.id;

    const lists = await this.#bookListsService.getUserLists(userId);

    res.formatResponse(lists);
  }
}
