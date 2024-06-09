// file for data base connection (postgresql)
import pg from "pg";
const { Pool } = pg;

let pool = null;

if (process.env.NODE_ENV === "production") {
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
pool.connect((err) => {
  if (err) throw err;
  console.log(`Conexion a la base de datos ${BD} completada`);
});

export { pool };
