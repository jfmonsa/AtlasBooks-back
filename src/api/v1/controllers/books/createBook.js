import { pool } from "../../../../db.js";
import cloudinary from "../../../../config/cloudinary.js";
import { CustomError } from "../../middlewares/errorMiddleware.js";

// Look at this beatiful declarative code,
// use declarative in every controller

/**
 * Create a book in the db
 * @param {*} req
 * @param {*} res
 */
export const createBook = async (req, res) => {
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

  // upload cover pic to cloudinary and get its path
  const cover = req.files.cover
    ? uploadToCloudinary(req.files.cover[0], "bookCoverPics")
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
  // TODO: replace this with cloudinary upload
  // const bookFiles = req.files["bookFiles"]
  //   ? req.files["bookFiles"].map(file => file.filename)
  //   : [];
  if (req.files.bookFiles) {
    req.files.bookFiles.forEach(async file => {
      let resultUpload = await cloudinary.uploader.upload(file.path, {
        folder: "books",
      });
      if (resultUpload.error) {
        throw new CustomError("Failed to upload book file", 500);
      }
      console.log(resultUpload);
      // insert into BOOK_FILES table
      await pool.query(
        `
          INSERT INTO BOOK_FILES 
            (idBook, pathF) 
          VALUES ($1, $2)`,
        [bookId, resultUpload.secure_url]
      );
    });
    // set bookFiles to the names of the uploaded files
  } else {
    throw new CustomError("There should be at least one book file", 500);
  }

  /*if (bookFiles.length > 0) {
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
    }*/

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
    throw new CustomError("There should be at least one author", 500);
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
    throw new CustomError("There should be at least one language", 500);
  }

  // ==== insert into  BOOK_IN_SUBCATEGORY table ====
  if (subcategoryIdsArray) {
    const insertSubcategoryQueries = subcategoryIdsArray.map(subcategoryId => {
      return pool.query(
        `INSERT INTO BOOK_IN_SUBCATEGORY 
              (idBook, idSubcategory) 
            VALUES ($1, $2)`,
        [bookId, subcategoryId]
      );
    });
    await Promise.all(insertSubcategoryQueries);
  }

  // ==== response ====
  res.status(201).send({ message: "Book created successfully" });
};

const validateBookData = data => {
  // Lógica de validación
};

const uploadToCloudinary = async (file, folder) => {
  const result = await cloudinary.uploader.upload(file.path, { folder });
  if (result.error) {
    throw new CustomError(`Failed to upload to ${folder}`, 500);
  }
  console.log(result);
  return result.secure_url;
};
