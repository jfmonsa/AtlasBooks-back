export default class BookCategoriesController {
  #bookCategoriesService;

  constructor({ bookCategoriesService }) {
    this.#bookCategoriesService = bookCategoriesService;

    this.getCategoriesAndSubcategoriesGrouped =
      this.getCategoriesAndSubcategoriesGrouped.bind(this);
    this.getSubCategoriesOfCategory =
      this.getSubCategoriesOfCategory.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
  }

  async getCategoriesAndSubcategoriesGrouped(_req, res) {
    const grouppedData =
      await this.#bookCategoriesService.getCategoriesAndSubcategoriesGrouped();

    res.formatResponse(grouppedData);
  }

  async getSubCategoriesOfCategory(req, res) {
    const { categoryId } = req.params;
    const subcategories =
      await this.#bookCategoriesService.getSubCategoriesOfCategory(categoryId);

    res.formatResponse(subcategories);
  }

  async getAllCategories(_req, res) {
    const categories = await this.#bookCategoriesService.getAllCategories();

    res.formatResponse(categories);
  }
}
