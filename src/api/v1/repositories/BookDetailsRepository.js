// repositorios??? son consultas que pueden llegar a ser compartidas por varios servicios
import { pool } from "../../../db.js";

/**
 * get a book based on its id
 */
export const getBookById = async idBook => {
  const book = await pool.query(`SELECT * FROM BOOK WHERE id = $1`, [idBook]);
  return book.rows.length > 0 ? book.rows[0] : null;
};

/**
 * get the authors of a book based on book id
 */
export const getBookAuthors = async idBook => {
  const authors = await pool.query(
    `SELECT author FROM BOOK_AUTHORS WHERE idBook = $1`,
    [idBook]
  );
  return authors.rows.map(authorObj => authorObj.author);
};

/**
 * Get the languages of a book based on book id
 */
export const getBookLanguages = async idBook => {
  const langs = await pool.query(
    `SELECT languageb FROM BOOK_LANG WHERE idBook = $1`,
    [idBook]
  );
  return langs.rows.map(langObj => langObj.languageb);
};

/**
 * Get the file names of a book based on book id
 */
export const getBookFileNames = async idBook => {
  const fileNames = await pool.query(
    `SELECT pathf FROM BOOK_FILES WHERE idBook = $1`,
    [idBook]
  );
  // TODO: Revisar esto
  return fileNames.rows.length > 0
    ? fileNames.rows[0].pathf.split(",").map(file => file.trim())
    : [];
};

/**
 * Get the file types of a book based on book file names array
 */
export const getBookFileTypes = bookFiles => {
  return [
    ...new Set(bookFiles.map(file => file.split(".").pop().toUpperCase())),
  ];
};

/**
 * Get the average rate of a book based on book id
 */
export const getBookRate = async idBook => {
  const queryRate = await pool.query(
    `SELECT ROUND(AVG(ratevalue),1) as rate_avg FROM BOOK_RATE WHERE idbook = $1`,
    [idBook]
  );
  return queryRate.rows[0].rate_avg ? queryRate.rows[0].rate_avg : 0;
};

/**
 * Get the subcategories and category of a book
 * @param {number} idBook - The id of the book
 * @returns {Object} - An object containing subcategories, subcategoriesIds, category, and categoryId
 */
export const getBookSubcategories = async idBook => {
  // Consulta para obtener subcategorías
  const { rows: subcategoryRows } = await pool.query(
    `SELECT idcategoryFather, sub.subcategoryname, sub.id as subcategoryId 
            FROM BOOK_IN_SUBCATEGORY insub 
            INNER JOIN SUBCATEGORY sub ON insub.idsubcategory = sub.id  
            WHERE idbook = $1`,
    [idBook]
  );

  // Verificar si se encontraron subcategorías
  if (subcategoryRows.length === 0) {
    return {
      subcategories: null,
      subcategoriesIds: null,
      category: null,
      categoryId: null,
    };
  }

  // Obtener el id de la categoría padre de la primera subcategoría
  const { idcategoryfather } = subcategoryRows[0];

  // Consulta para obtener la categoría
  const { rows: categoryRows } = await pool.query(
    `SELECT id, categoryname 
            FROM CATEGORY 
            WHERE id = $1`,
    [idcategoryfather]
  );

  // Retornar los resultados
  return {
    subcategories: subcategoryRows.map(subObj => subObj.subcategoryname),
    subcategoriesIds: subcategoryRows.map(subObj => subObj.subcategoryid),
    category: categoryRows.length > 0 ? categoryRows[0].categoryname : null,
    categoryId: categoryRows.length > 0 ? categoryRows[0].id : null,
  };
};
//aux functions - getBookWithDetails
