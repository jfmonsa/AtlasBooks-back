import pg from "pg";
const { Pool } = pg;

/** Singleton class to manage the database connection */
class Database {
  constructor() {
    this.pool = null;
  }

  initialize() {
    if (this.pool) return;

    const DB_ENV = process.env.DB_ENV;
    const config =
      DB_ENV === "prod"
        ? { connectionString: process.env.POSTGRES_URL }
        : {
            user: process.env.LOCALDB_USER,
            host: process.env.LOCALDB_HOST,
            database: process.env.LOCALDB_NAME,
            password: process.env.LOCALDB_PASSWORD,
            port: process.env.LOCALDB_PORT,
          };

    this.pool = new Pool(config);

    // Test connection
    this.pool
      .connect()
      .then(() => {
        console.log(`-> 🗂️  Connection to (${DB_ENV}) DB ok`);
      })
      .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1);
      });
  }

  getPool() {
    if (!this.pool) this.initialize();
    return this.pool;
  }
}

// Singleton instance
export const db = new Database();
