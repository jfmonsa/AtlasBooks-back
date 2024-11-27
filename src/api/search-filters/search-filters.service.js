export default class SearchFiltersService {
  #searchFiltersRepository;

  constructor({ searchFiltersRepository }) {
    this.#searchFiltersRepository = searchFiltersRepository;
  }

  // TODO: implement pagination for search results

  async searchBooks(searchOptions) {
    return await this.#searchFiltersRepository.searchBooks(searchOptions);
  }

  async searchUsers({ search }) {
    return await this.#searchFiltersRepository.searchUsers({ search });
  }

  async searchPublicLists({ listName }) {
    return await this.#searchFiltersRepository.searchPublicLists({ listName });
  }
}
