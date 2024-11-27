import BaseRepository from "./base.repository.js";

export default class SearchFiltersRepository extends BaseRepository {
  // Note: this repository doesn't specific table name
  // because it's not associated with a single table
  constructor() {
    super(); // no table name
  }

  async searchBooks({
    search,
    language,
    yearFrom,
    yearTo,
    categoryId,
    subCategoryId,
  }) {
    let baseQuery = `
        SELECT 
            book.title, 
            book.year_released,
            book.cover_img_path, 
            book.id, 
            book.publisher, 
            book_authors.author AS author,
            book_lang.language AS language,
            book_rate.rate_value AS rating
        FROM
            book
        INNER JOIN
            book_authors ON book.id = book_authors.id_book
        INNER JOIN
            book_lang ON book.id = book_lang.id_book
        LEFT JOIN
            book_rate ON book.id = book_rate.id_book`;

    let conditions = [];
    let params = [];

    if (search) {
      conditions.push(`(
                  book.title ILIKE $${conditions.length + 1}
                  OR book_authors.author ILIKE $${conditions.length + 1}
                  OR book.isbn ILIKE $${conditions.length + 1}
                  )`);
      params.push(`%${search}%`);
    }

    if (yearFrom) {
      conditions.push(`book.year_released >= $${conditions.length + 1}`);
      params.push(yearFrom);
    }

    if (yearTo) {
      conditions.push(`book.year_released <= $${conditions.length + 1}`);
      params.push(yearTo);
    }

    if (language) {
      conditions.push(`book_lang.language ILIKE $${conditions.length + 1}`);
      params.push(language);
    }

    if (categoryId) {
      baseQuery += `
            INNER JOIN book_in_subcategory bis ON book.id = bis.id_book
            INNER JOIN subcategory sc ON bis.id_subcategory = sc.id
            INNER JOIN category c ON sc.id_category_father = c.id
          `;
      conditions.push(`c.id = $${conditions.length + 1}`);
      params.push(categoryId);
    }

    if (subCategoryId) {
      if (!categoryId) {
        baseQuery += `
            INNER JOIN book_in_subcategory bis ON book.id = bis.id_book
            INNER JOIN subcategory sc ON bis.id_subcategory = sc.id
          `;
      }
      conditions.push(`sc.id = $${conditions.length + 1}`);
      params.push(subCategoryId);
    }

    if (conditions.length > 0) {
      baseQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    const result = await this.executeQuery(baseQuery, params);

    const transformedResults = result.map(book => ({
      ...book,
      rating: book.rateValue || 0,
    }));

    return transformedResults;
  }

  async searchUsers({ search }) {
    const query = `
        SELECT *
        FROM users
        WHERE
            users.nickname ILIKE $1
            OR users.email ILIKE $1
            OR users.full_name ILIKE $1`;
    return await this.executeQuery(query, [`%${search}%`]);
  }

  async searchPublicLists({ listName }) {
    const query = `
        SELECT *
        FROM book_list
        WHERE
            (book_list.title ILIKE $1 OR book_list.description ILIKE $1)
            AND book_list.is_public = true`;
    return await this.executeQuery(query, [`%${listName}%`]);
  }
}
