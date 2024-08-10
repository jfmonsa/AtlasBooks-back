import { pool } from "../../../../db.js";
import cloudinary from "../../../../config/cloudinary.js";
import { uploader } from "cloudinary";

/**
 * Create a book in the db
 * @param {*} req
 * @param {*} res
 */
export const createBook = async (req, res) => {
  try {
    //getting data
    const {
      isbn,
      title,
      descriptionB,
      yearReleased,
      vol,
      nPages,
      publisher,
      //multivalued fields
      authors,
      languages,
      //(n,m) rel
      subcategoryIds,
    } = req.body;

    // Convertir strings JSON a arrays
    const authorsArray = authors; //JSON.parse(authors);
    const languagesArray = languages; //JSON.parse(languages);
    const subcategoryIdsArray = subcategoryIds; //JSON.parse(subcategoryIds);

    // uploading book files and book cover pic
    if (req.files.cover) {
      let resultUpload = await cloudinary.uploader.upload(
        req.files.cover[0].path,
        {
          folder: "bookCoverPics",
        }
      );
      console.log(resultUpload);
    }

    if (req.files.bookFiles) {
      req.files.bookFiles.forEach(async file => {
        let resultUpload = await cloudinary.uploader.upload(file.path, {
          folder: "books",
        });
        console.log(resultUpload);
      });
    }
    /**
       * if (uploadResult.error) {
      console.error(uploadResult.error);
      res.status(500).json({ message: 'Upload failed' });
    } else {
      console.log('File uploaded successfully!');
      res.json({ message: 'Success!', data: uploadResult }); // Respond with upload data (URL, etc.)
    }
       */

    //Get path book cover
    const cover = req.files["cover"]
      ? req.files["cover"][0].filename
      : "default.jpg";
    // ==== insert into BOOK table =====
    const query_values = [
      isbn,
      title,
      descriptionB,
      yearReleased,
      vol,
      nPages,
      publisher,
      cover,
    ];

    const newBook_query = await pool.query(
      `INSERT INTO BOOK 
        (isbn, title, descriptionB, yearReleased, vol, nPages, 
          publisher, pathBookCover) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      query_values
    );

    // ==== insert into BOOK_FILES talbe =====
    // -- getting the auto increment id of BOOK
    const bookId = newBook_query.rows[0].id;

    // -- Get the paths of uploaded files
    const bookFiles = req.files["bookFiles"]
      ? req.files["bookFiles"].map(file => file.filename)
      : [];

    if (bookFiles.length > 0) {
      const fileQueries = bookFiles.map(path =>
        pool.query(
          `
          INSERT INTO BOOK_FILES 
            (idBook, pathF) 
          VALUES ($1, $2)`,
          [bookId, path]
        )
      );
      await Promise.all(fileQueries);
    } else {
      res.status(500).send({ error: "there should be at least one book file" });
    }

    // ==== insert into BOOK_AUTHORS talbe =====
    if (authorsArray) {
      const insertAuthorQueries = authorsArray.map(async author => {
        pool.query(
          `INSERT INTO BOOK_AUTHORS 
            (idBook, author) 
          VALUES ($1, $2)`,
          [bookId, author]
        );
      });
      await Promise.all(insertAuthorQueries);
    } else {
      res.status(500).send({ error: "there should be at least one author" });
    }

    // ==== insert into BOOK_LANG talbe =====
    if (languagesArray) {
      const insertLanguageQueries = languagesArray.map(async language => {
        pool.query(
          `INSERT INTO BOOK_LANG 
            (idBook, languageB) 
          VALUES ($1, $2)`,
          [bookId, language]
        );
      });
      await Promise.all(insertLanguageQueries);
    } else {
      res.status(500).send({ error: "there should be at least one language" });
    }

    // ==== insert into  BOOK_IN_SUBCATEGORY table ====
    if (subcategoryIdsArray) {
      const insertSubcategoryQueries = subcategoryIdsArray.map(
        subcategoryId => {
          return pool.query(
            `INSERT INTO BOOK_IN_SUBCATEGORY 
              (idBook, idSubcategory) 
            VALUES ($1, $2)`,
            [bookId, subcategoryId]
          );
        }
      );
      await Promise.all(insertSubcategoryQueries);
    }

    // ==== response ====
    res.status(201).send({ message: "Book created successfully" });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).send({ error: "Failed to create book" });
  }
};
