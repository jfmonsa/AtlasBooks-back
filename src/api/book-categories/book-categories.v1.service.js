import { NotFoundError } from "../../helpers/exeptions.js";

export default class BookCategoriesService {
  #bookCategoriesRepository;

  constructor({ bookCategoriesRepository }) {
    this.#bookCategoriesRepository = bookCategoriesRepository;
  }

  async getCategoriesAndSubcategoriesGrouped() {
    const categoriesAndSubcategories =
      await this.#bookCategoriesRepository.getCategoriesAndSubcategoriesGrouped();
    return categoriesAndSubcategories;
  }

  async getSubCategoriesOfCategory(categoryId) {
    const subcategories =
      await this.#bookCategoriesRepository.getSubCategoriesOfCategory(
        categoryId
      );
    if (subcategories.length === 0) {
      throw new NotFoundError("Category not found");
    }
    return subcategories;
  }

  async getAllCategories() {
    return await this.#bookCategoriesRepository.getAllCategories();
  }
}
