// file for data base connection (postgresql)
import pg from "pg";
const { Pool } = pg;

export const pool = new Pool ({ 
  user: process.env.LOCALDB_USER,
  host: process.env.LOCALDB_HOST,
  database : process.env.LOCALDB_NAME,
  password : "RamSterB",
  port : process.env.LOCALDB_PORT,
});

pool.connect((err) => {
  if (err) throw err;
  console.log("Conexion a la base de datos completada");
});