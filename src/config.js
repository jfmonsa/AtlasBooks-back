/* File to save constants */

export const db = {
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Atlpassword08.",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || "AtlasBooks",
};

export const port = process.env.PORT || 3001;
