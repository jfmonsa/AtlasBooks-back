// file for data base connection (postgresql)
import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

pool.connect((err) => {
  if (err) throw err;
  console.log("Conexion a la base de datos completada");
});
