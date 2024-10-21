import BaseRepository from "./base.repository.js";

export default class BookList extends BaseRepository {
  constructor() {
    super("book_list");
  }

  async createDefaultList(userId, client) {
    super.create(
      {
        title: "Me Gusta",
        descriptionl:
          "Aquí se muestran los libros a los que les has dado 'me gusta'.",
        datel: "NOW()",
        idusercreator: userId,
        ispublic: false,
      },
      client
    );
  }
}
