/* file for data base connection (postgresql) */
import pg from "pg";
import { db } from "./config.js";
const { Pool } = pg;

export const pool = new Pool({
  connectionString: "postgres://default:FNS5KHhBmAi3@ep-empty-bonus-a4b0x0gj-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
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

//module.exports = pool;
