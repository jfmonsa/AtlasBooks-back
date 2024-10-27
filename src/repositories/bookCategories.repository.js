import BaseRepository from "./base.repository.js";

export default class BookCategories extends BaseRepository {
  constructor() {
    super("book_category");
  }

  async getBookCategories(idBook) {
    const { rows: subCategoriesRows } = await super.executeQuery(
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

    const { rows: categoryRows } = await super.executeQuery(
      `SELECT id, name as categoryName 
            FROM CATEGORY 
            WHERE id = $1`,
      [idCategoryFather]
    );

    return {
      subcategories: subCategoriesRows.map(subObj => subObj.subcategoryname),
      subcategoriesIds: subCategoriesRows.map(subObj => subObj.subcategoryid),
      category: categoryRows.length > 0 ? categoryRows[0].categoryName : null,
      categoryId: categoryRows.length > 0 ? categoryRows[0].id : null,
    };
  }
}
