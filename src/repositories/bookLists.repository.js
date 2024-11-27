import BaseRepository from "./base.repository.js";

export default class BookListsRepository extends BaseRepository {
  constructor() {
    super("book_list");
  }

  async createDefaultList(userId, client) {
    await super.create(
      {
        title: "Me Gusta",
        description:
          "Aquí se muestran los libros a los que les has dado 'me gusta'.",
        dateCreatedAt: "NOW()",
        idUser: userId,
        isPublic: false,
      },
      client
    );
  }

  async listOfUserWithSameTitleExists(title, idUser) {
    return await super.findWhere({ title, idUser });
  }

  async createList(listData) {
    return await super.create({ ...listData, dateCreatedAt: "NOW()" });
  }

  async getBookDetailsOfList(listId) {
    const query = `
      SELECT 
        b.id,
        b.title,
        b.cover_img_path,
        array_agg(ba.author) AS authors
      FROM 
        book_in_list bil
        JOIN book b ON b.id = bil.id_book
        JOIN book_authors ba ON ba.id_book = b.id
      WHERE 
        bil.id_list = $1
      GROUP BY 
        b.id, b.title, b.cover_img_path
    `;
    const books = await super.executeQuery(query, [listId]);

    return books.map(book => ({
      ...book,
      authors: book.authors.join(", "),
    }));
  }

  async getListsWhereBookIs(bookId, userId) {
    const query = `
      SELECT 
        bl.id AS list_id,
        bl.title AS listTitle,
        EXISTS (
          SELECT 1
          FROM book_in_list bil
          WHERE bil.id_list = bl.id AND bil.id_book = $2
        ) AS currentBookIn
      FROM 
        book_list bl
      WHERE 
        bl.id_user = $1
    `;
    return await super.executeQuery(query, [userId, bookId]);
  }

  async addBookToList(bookId, listId) {
    const query = `
      INSERT INTO book_in_list (id_book, id_list)
      VALUES ($1, $2)
    `;
    await super.executeQuery(query, [bookId, listId]);
  }

  async removeBookFromList(bookId, listId) {
    const query = `
      DELETE FROM book_in_list
      WHERE id_book = $1 AND id_list = $2
    `;
    await super.executeQuery(query, [bookId, listId]);
  }

  async getUserLists(userId) {
    const query = `
      SELECT 
        bl.id,
        bl.title,
        bl.description,
        bl.is_public,
        COUNT(bil.id_list) AS book_count
      FROM 
        book_list bl
        LEFT JOIN book_in_list bil ON bl.id = bil.id_list
      WHERE 
        bl.id_user = $1
      GROUP BY 
        bl.id
    `;
    return await super.executeQuery(query, [userId]);
  }
}
