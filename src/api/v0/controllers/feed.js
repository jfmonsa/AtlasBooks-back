import { pool } from "../db.js";
/**
 * Return a list of books (objects)
 * @param {*} req
 * @param {*} res
 */
export const getFeedRecomended = async (req, res) => {
  try {
    // traer 50 libros que tenga converPath en el siguiente orden  de prioridad
    /*
    1.Hacer consulta para que 10 libros sean de los más descargados en la página
    2.obtener la categoria de (2 o más) de los 10 libros anteriores y en base a ello traer otros 10
    3. Meter dos de los libros más recientes
    4.El resto de libros obtenerlos de manera random
    5. hacer shuffle de todo el array antes de devolverlo
    */
    //TODO: 1.Para un futuro hacer que primero se recomienden libros en base al usuario (su historial de descargas)
    let results = [];

    //1.Hacer consulta para que 10 libros sean de los más descargados en la página
    const mostDownloadedBooksQuery = await pool.query(
      `SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors, COUNT(d.idbook) AS downloads
      FROM BOOK b
      INNER JOIN BOOK_DOWNLOAD d ON b.id = d.idbook
      INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
      WHERE b.pathbookcover <> 'default.jpg'
      GROUP BY b.id
      ORDER BY downloads DESC
      LIMIT 10`
    );
    //2. obtener la categoria de (2 o más hata completar máximo 10) de los 10 libros anteriores y en base a ello traer otros 10
    const mostDownloaded = mostDownloadedBooksQuery.rows;
    results = results.concat(mostDownloaded);

    if (mostDownloaded.length > 0) {
      // Obtener las categorías de los libros más descargados
      const mostDownloadedBookIds = results.map((book) => book.id);
      const categoriesQuery = await pool.query(
        `SELECT DISTINCT sc.idcategoryfather
        FROM BOOK_IN_SUBCATEGORY bis
        INNER JOIN SUBCATEGORY sc ON bis.idsubcategory = sc.id
        WHERE bis.idbook = ANY($1::int[])`,
        [mostDownloadedBookIds]
      );
      if (categoriesQuery.rows.length > 0) {
        const categoryIds = categoriesQuery.rows.map(
          (row) => row.idcategoryfather
        );

        // Obtener 10 libros adicionales basados en las categorías de los libros más descargados
        const relatedBooksQuery = await pool.query(
          `SELECT DISTINCT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors
           FROM BOOK b
           INNER JOIN BOOK_IN_SUBCATEGORY bis ON b.id = bis.idbook
           INNER JOIN SUBCATEGORY sc ON bis.idsubcategory = sc.id
           INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
           WHERE sc.idcategoryfather = ANY($1::int[])
           AND b.id <> ALL ($2::int[])
           AND b.pathbookcover <> 'default.jpg'
           GROUP BY b.id
           LIMIT 10`,
          [categoryIds, mostDownloadedBookIds]
        );
        results = results.concat(relatedBooksQuery.rows);
      }
    }
    // 3. Meter dos de los libros más recientes
    const recentBooksQuery = await pool.query(
      `SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors
      FROM BOOK b
      INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
      WHERE b.pathbookcover <> 'default.jpg'
      AND b.id <> ALL ($1::int[])
      GROUP BY b.id
      ORDER BY b.id DESC
      LIMIT 2`,
      [results.map((book) => book.id)]
    );
    results = results.concat(recentBooksQuery.rows);

    // Obtener libros aleatorios para completar hasta 50 libros
    const remainingBooksCount = 50 - results.length;
    if (remainingBooksCount > 0) {
      const randomBooksQuery = await pool.query(
        `SELECT b.id, b.title, b.pathbookcover,  array_agg(ba.author) AS authors
        FROM BOOK b
        INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
        WHERE b.pathbookcover <> 'default.jpg'
        AND b.id <> ALL ($1::int[])
        GROUP BY b.id
        ORDER BY RANDOM()
        LIMIT $2`,
        [results.map((book) => book.id), remainingBooksCount]
      );
      results = results.concat(randomBooksQuery.rows);

      results = results.map((book) => ({
        authors: book.authors.join(", "),
        title: book.title,
        pathBookCover: book.pathbookcover,
        bookId: book.id,
      }));
      //console.log(recommended_feed);
    }
    res.status(201).send({
      recommended_feed: results,
    });
  } catch (error) {
    console.error("Error getting recommende books for fetch:", error);
    res
      .status(500)
      .send({ error: "Error list of recommended books for fetch" });
  }
};
