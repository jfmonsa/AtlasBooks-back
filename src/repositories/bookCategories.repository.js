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

  /**
   * Retrieves a list of categories with their subcategories grouped.
   * Only categories and subcategories that have an associated book are included.
   *
   * @returns {Promise<Array>} A promise that resolves to an array of categories with their subcategories.
   */
  async getCategoriesAndSubcategoriesGrouped() {
    const rows = await super.executeQuery(
      `SELECT c.id AS categoryId, c.name AS categoryName, 
              s.id AS subcategoryId, s.name AS subcategoryName
       FROM category c
       JOIN subcategory s ON s.id_category_father = c.id
       JOIN book_in_subcategory bis ON bis.id_subcategory = s.id
       GROUP BY c.id, c.name, s.id, s.name`
    );

    // Group categories and subcategories from the result
    const groupedCategories = rows.reduce((acc, row) => {
      // Check if the category is already in the accumulator
      let category = acc.find(cat => cat.categoryId === row.categoryid);

      // If it doesn't exist, add it with an empty list of subcategories
      if (!category) {
        category = {
          category: row.categoryname,
          categoryId: row.categoryid,
          subcategories: [],
        };
        acc.push(category);
      }

      // Add the current subcategory to the category's subcategory list
      category.subcategories.push({
        id: row.subcategoryid,
        name: row.subcategoryname,
      });

      return acc;
    }, []);

    return groupedCategories;
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

    const result = {
      subcategories: subCategoriesRows.map(subObj => subObj.name),
      subcategoriesIds: subCategoriesRows.map(subObj => subObj.subcategoryid),
      category: categoryRows ? categoryRows.name : null,
      categoryId: categoryRows ? categoryRows.id : null,
    };
    return result;
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
