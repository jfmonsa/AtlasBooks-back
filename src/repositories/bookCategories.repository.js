import BaseRepository from "./base.repository.js";

export default class BookCategories extends BaseRepository {
  constructor() {
    super("category");
  }

  async getAllCategories() {
    return await super.findAll();
  }

  async getSubCategoriesOfCategory(categoryId) {
    return await super.executeQuery(
      `select id, name AS subcategory_name
      from subcategory 
      where id_category_father = $1`,
      [categoryId]
    );
  }

  async getCategoriesAndSubcategoriesGrouped() {
    const categories = await this.getAllCategories();
    const categoriesAndSubcategories = await Promise.all(
      categories.map(async category => {
        const subcategories = await this.getSubCategoriesOfCategory(
          category.id
        );
        return {
          category: category.name,
          categoryId: category.id,
          subcategories: subcategories.map(subcategory => ({
            id: subcategory.id,
            name: subcategory.subcategoryName,
          })),
        };
      })
    );
    return categoriesAndSubcategories;
  }

  // for book related with categories
  async getBookCategories(idBook) {
    const subCategoriesRows = await super.executeQuery(
      `SELECT id_category_father, sub.name, sub.id as subcategoryId 
            FROM BOOK_IN_SUBCATEGORY insub 
            INNER JOIN SUBCATEGORY sub ON insub.id_subcategory = sub.id  
            WHERE id_book = $1`,
      [idBook]
    );
    if (subCategoriesRows.length === 0) {
      return {
        subcategories: null,
        subcategoriesIds: null,
        category: null,
        categoryId: null,
      };
    }

    // get category father of the first subcategory
    const { idCategoryFather } = subCategoriesRows[0];

    const categoryRows = await super.findById(idCategoryFather);

    return {
      subcategories: subCategoriesRows.map(subObj => subObj.name),
      subcategoriesIds: subCategoriesRows.map(subObj => subObj.subcategoryid),
      category: categoryRows.length > 0 ? categoryRows[0].name : null,
      categoryId: categoryRows.length > 0 ? categoryRows[0].id : null,
    };
  }

  // book creation

  /**
   * Inserts the book subcategories into the database.
   * @param {number} bookId - The ID of the book.
   * @param {Array} subcategoryIds - The IDs of the subcategories.
   */
  async insertBookSubcategories(bookId, subcategoryIds, client) {
    if (subcategoryIds && subcategoryIds.length > 0) {
      const query = `
        INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory)
        VALUES ${subcategoryIds.map((_, index) => `($1, $${index + 2})`).join(", ")}
      `;
      await super.executeQuery(query, [bookId, ...subcategoryIds], client);
    }
  }
}
