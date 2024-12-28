import pg from "pg";
const { Pool } = pg;

/** Singleton class to manage the database connection */
class Database {
  constructor() {
    this.pool = null;
  }

  initialize() {
    if (this.pool) return;

    const config =
      process.env.NODE_ENV === "prod"
        ? { connectionString: process.env.POSTGRES_URL }
        : {
            user: process.env.LOCALDB_USER,
            host: process.env.LOCALDB_HOST,
            database: process.env.LOCALDB_NAME,
            password: process.env.LOCALDB_PASSWORD,
            port: process.env.LOCALDB_PORT,
            idleTimeoutMillis: 30000, // 30 seconds
            connectionTimeoutMillis: 2000, // 2 seconds
          };

    this.pool = new Pool(config);

    // Handle connection errors
    this.pool.on("error", err => {
      console.error("Unexpected error on idle client", err);
      // automatic reconnect when error occurs
      this.pool.end().then(() => this.initialize());
    });

    // Test connection
    this.pool
      .connect()
      .then(() => {
        console.log(`-> 🗂️  Connection to (${process.env.NODE_ENV}) DB ok`);
      })
      .catch(err => {
        console.error("Error connecting to the database", err);
      });
  }

  getPool() {
    if (!this.pool) this.initialize();
    return this.pool;
  }
}

// Singleton instance
export const db = new Database();
