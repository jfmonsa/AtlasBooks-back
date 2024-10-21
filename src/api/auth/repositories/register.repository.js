import { pool } from "../../../common/config/db.js";

export const getUserByEmail = async email => {
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return user.rows?.[0];
};

export const getUserByNickname = async nickname => {
  const user = await pool.query("SELECT * FROM users WHERE nickname = $1", [
    nickname,
  ]);
  return user.rows?.[0];
};

export const createAndGetUser = async (
  client,
  name,
  email,
  password,
  nickname,
  country
) => {
  const query = `INSERT INTO users (
      nameu, email, passwordu, nickname, country, registerdate, statusu, isadmin, pathprofilepic
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;

  const result = await client.query(query, [
    name,
    email,
    password,
    nickname,
    country,
    new Date(),
    true,
    false,
    "../storage/usersProfilePic/default.webp",
  ]);

  return result.rows[0];
};

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
