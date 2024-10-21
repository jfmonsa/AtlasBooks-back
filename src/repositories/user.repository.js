import BaseRepository from "./base.repository.js";

/** Represents a repository for interacting with the users table. */
export default class UserRepository extends BaseRepository {
  constructor() {
    super("users");
  }

  async getUserByEmail(email) {
    const result = await super.findWhere({ email });
    return result?.[0] || null;
  }

  async getUserByNickname(nickname) {
    const result = await super.findWhere({ nickname });
    return result?.[0] || null;
  }

  async getUserByNicknameOrEmail(emailOrNickname) {
    const result = await super.executeQuery(
      `SELECT * FROM users WHERE email = $1 or nickname = $1`,
      [emailOrNickname]
    );
    return result?.[0] || null;
  }

  async createUser({ name, email, password, nickname, country }, client) {
    const newUser = await super.create(
      {
        nameu: name,
        email: email,
        passwordu: password,
        nickname: nickname,
        country: country,
        registerdate: "NOW()",
        statusu: true,
        isadmin: false,
        pathprofilepic: "../storage/usersProfilePic/default.webp",
      },
      client
    );
    delete newUser.passwordu;
    return newUser;
  }
}

/*
  export const createDefaultBookList = async (client, userId) => {
  await client.query(
    `INSERT INTO book_list (title, descriptionl, datel, idusercreator, ispublic) 
     VALUES ($1, $2, $3, $4, $5)`,
    [
      "Me Gusta",
      "Aquí se muestran los libros a los que les has dado 'me gusta'.",
      new Date(),
      userId,
      false,
    ]
  );
};

export const getUserByNicknameOrEmail = async email => {
  const user = await pool.query(
    "SELECT * FROM users WHERE email = $1 or nickname = $1",
    [email]
  );
  return user.rows?.[0];
};

  */
