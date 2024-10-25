import BaseRepository from "./base.repository.js";

export default class BookList extends BaseRepository {
  constructor() {
    super("book_list");
  }

  async createDefaultList(userId, client) {
    console.log("inicio de createDefaultList");
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
    console.log("Fin de createDefaultList");
  }
}
