import { pool } from "../../../../db.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../../../../utils/handleJWT.js";
import { CustomError } from "../../middlewares/errorMiddleware.js";

/* Recomendaciones y mejoras adicionales:

1. Usa constantes para los códigos de estado HTTP para mejorar la legibilidad.
2. Considera usar un ORM como Sequelize o TypeORM para manejar las consultas a la base de datos de manera más limpia y segura.
3. Implementa validación de datos más robusta, posiblemente usando una biblioteca como Joi o express-validator.
4. Considera separar la lógica de negocio del controlador en servicios separados.
5. Usa transacciones de base de datos para garantizar la integridad de los datos al realizar múltiples operaciones.
6. Implementa logging para un mejor seguimiento de errores y depuración */

/** register controller
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */

export const register = async (req, res) => {
  const { name, email, password, nickName, country } = req.body;

  // validations
  if (!name || !email || !password || !nickName || !country) {
    throw new CustomError("Missing fields", 400);
  }

  const emailExists = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (emailExists.rows.length > 0) {
    throw new CustomError("Email already exists", 400);
  }

  const nickExists = await pool.query(
    "SELECT * FROM users WHERE nickname = $1",
    [nickName]
  );
  if (nickExists.rows.length > 0) {
    throw new CustomError("Nickname already exists", 400);
  }

  // insert
  const registerDate = new Date();
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (
      nameu, email, passwordu, nickname, country, registerdate, statusu, isadmin, pathprofilepic
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      name,
      email,
      passwordHash,
      nickName,
      country,
      registerDate,
      true,
      false,
      "../storage/usersProfilePic/default.webp",
    ]
  );

  await pool.query(
    `INSERT INTO book_list (title, descriptionl, datel, idusercreator, ispublic) 
     VALUES ($1, $2, $3, $4, $5)`,
    [
      "Me Gusta",
      "Aquí se muestran los libros a los que les has dado 'me gusta'.",
      registerDate,
      result.rows[0].id,
      false,
    ]
  );

  const newUser = {
    id: result.rows[0].id,
    name: result.rows[0].nameu,
    email: result.rows[0].email,
    nickname: result.rows[0].nickname,
    country: result.rows[0].country,
    registerDate: result.rows[0].registerdate,
    status: result.rows[0].statusu,
    isAdmin: result.rows[0].isadmin,
    pathProfilePic: result.rows[0].pathprofilepic,
  };

  const token = await createAccessToken(result.rows[0]);
  res.cookie("token", token);

  res.status(201).json(newUser);
};
