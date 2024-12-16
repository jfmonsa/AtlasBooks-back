import { searchBooksInElastic } from "../../repositories/elasticSearch.repository.js";
export default class SearchFiltersController {
  #searchFiltersService;

  constructor({ searchFiltersService }) {
    this.#searchFiltersService = searchFiltersService;

    this.searchBooks = this.searchBooks.bind(this);
    this.searchUsers = this.searchUsers.bind(this);
    this.searchPublicLists = this.searchPublicLists.bind(this);
  }

  async searchBooks(req, res) {
    const elasticSearchIds = await searchBooksInElastic(req.query.search);
    const books = await this.#searchFiltersService.searchBooks({
      ...req.query,
      elasticSearch: elasticSearchIds,
    });
    return res.formatResponse(books);
  }

  async searchUsers(req, res) {
    const users = await this.#searchFiltersService.searchUsers(req.query);
    return res.formatResponse(users);
  }

  async searchPublicLists(req, res) {
    const lists = await this.#searchFiltersService.searchPublicLists(req.query);
    return res.formatResponse(lists);
  }

  async fetchBookTitles(req, res) {
    const titles = await this.#searchFiltersService.fetchBookTitles();
    return res.formatResponse(titles);
  }
}
