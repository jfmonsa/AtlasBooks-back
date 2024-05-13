/* file for data base connection (postgresql) */

import pg from "pg";
import { db } from "./config.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

// export const pool = new pg.Pool({
//   user: db.user,
//   password: db.password,
//   host: db.host,
//   port: db.port,
//   database: db.database,
// });

//pool.on("connect", () => console.log("DB connected"));

pool.connect((err) => {
    if (err) throw err;
    console.log("Conexion a la base de datos completada");
})

module.exports = pool;
