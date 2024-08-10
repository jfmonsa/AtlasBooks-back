/**
 * Retrieves related books based on the provided parameters.
 *
 * @param {string} idBook - The ID of the book.
 * @param {Array<string>} subcategoryIds - An array of subcategory IDs.
 * @param {string} categoryId - The ID of the category.
 * @returns {Promise<Array<Object>>} The formatted array of related books.
 */
export const getRelatedBooks = async (idBook, subcategoryIds, categoryId) => {
  try {
    const relatedBooks = await getRelatedBooksByPriority(
      idBook,
      subcategoryIds,
      categoryId
    );
    return formatRelatedBooks(relatedBooks);
  } catch (error) {
    console.error("Error getting related books:", error);
    return [];
  }
};

/**
 * Retrieves related books based on priority.
 *  1. Related books by subcategory
 *  2. Related books by category
 *  3. Random books
 *
 * @param {string} idBook - The ID of the book.
 * @param {Array<string>} subcategoryIds - The IDs of the subcategories.
 * @param {string} categoryId - The ID of the category.
 * @returns {Promise<Array>} The array of related books.
 */
const getRelatedBooksByPriority = async (
  idBook,
  subcategoryIds,
  categoryId
) => {
  let relatedBooks = await getRelatedBooksBySubcategory(idBook, subcategoryIds);

  if (needMoreBooks(relatedBooks)) {
    const additionalBooks = await getRelatedBooksByCategory(
      idBook,
      categoryId,
      getRemainingBooksCount(relatedBooks)
    );
    relatedBooks = [...relatedBooks, ...additionalBooks];
  }

  if (needMoreBooks(relatedBooks)) {
    const randomBooks = await getRandomBooks(
      idBook,
      getRemainingBooksCount(relatedBooks)
    );
    relatedBooks = [...relatedBooks, ...randomBooks];
  }

  return relatedBooks;
};

/**
 * Retrieves related books based on a given book ID and subcategory IDs.
 *
 * @param {number} idBook - The ID of the book.
 * @param {number[]} subcategoryIds - An array of subcategory IDs.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of related books.
 */
const getRelatedBooksBySubcategory = async (idBook, subcategoryIds) => {
  if (!subcategoryIds) return [];

  const query = `
    SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors 
    FROM BOOK b
    INNER JOIN BOOK_IN_SUBCATEGORY bis ON b.id = bis.idbook
    INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
    WHERE bis.idsubcategory = ANY($1) AND b.id != $2
    GROUP BY b.id
    LIMIT 20
  `;
  const { rows } = await pool.query(query, [subcategoryIds, idBook]);
  return rows;
};

/**
 * Retrieves related books based on the category of a given book.
 *
 * @param {number} idBook - The ID of the book.
 * @param {number} categoryId - The ID of the category.
 * @param {number} limit - The maximum number of related books to retrieve.
 * @returns {Promise<Array>} - A promise that resolves to an array of related books.
 */
const getRelatedBooksByCategory = async (idBook, categoryId, limit) => {
  if (!categoryId) return [];

  const query = `
    SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors
    FROM BOOK b
    INNER JOIN BOOK_IN_SUBCATEGORY bis ON b.id = bis.idbook
    INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
    WHERE bis.idsubcategory IN (
      SELECT id FROM SUBCATEGORY WHERE idcategoryfather = $1
    ) AND b.id != $2
    GROUP BY b.id
    LIMIT $3
  `;
  const { rows } = await pool.query(query, [categoryId, idBook, limit]);
  return rows;
};

/**
 * Retrieves a list of random books excluding the specified book.
 *
 * @param {number} idBook - The ID of the book to exclude from the result.
 * @param {number} limit - The maximum number of random books to retrieve.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of objects representing the random books.
 */
const getRandomBooks = async (idBook, limit) => {
  const query = `
    SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors
    FROM BOOK b
    INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
    WHERE b.id != $1
    GROUP BY b.id
    ORDER BY RANDOM()
    LIMIT $2
  `;
  const { rows } = await pool.query(query, [idBook, limit]);
  return rows;
};

const needMoreBooks = books => books.length < 20;

const getRemainingBooksCount = books => 20 - books.length;

const formatRelatedBooks = books => {
  return books.map(book => ({
    authors: book.authors.join(", "),
    title: book.title,
    pathBookCover: book.pathbookcover,
    bookId: book.id,
  }));
};
