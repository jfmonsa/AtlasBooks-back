// file for data base connection (postgresql)
import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
const { Pool } = pg;

let pool = null;
const DB_ENV = process.env.DB_ENV;

if (DB_ENV === "prod") {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
} else {
  pool = new Pool({
    user: process.env.LOCALDB_USER,
    host: process.env.LOCALDB_HOST,
    database: process.env.LOCALDB_NAME,
    password: process.env.LOCALDB_PASSWORD,
    port: process.env.LOCALDB_PORT,
  });
}
pool.connect(err => {
  if (err) throw err;
  console.log(`🗂️  Conexion a la base de datos -${DB_ENV}- completada`);
});

export { pool };
