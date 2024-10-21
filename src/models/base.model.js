import { pool } from "../config/db";

/**
 * Represents a base model for interacting with a database table.
 * @class
 */
export class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async excecuteQuery(query, params) {
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    return this.excecuteQuery(query);
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    return this.excecuteQuery(query, [id])[0];
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const query = `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(", ")}) RETURNING *`;
    return this.excecuteQuery(query, values)[0];
  }

  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const query = `UPDATE ${this.tableName} SET ${keys.map((key, i) => `${key} = $${i + 1}`).join(", ")} WHERE id = $${keys.length + 1} RETURNING *`;
    return this.excecuteQuery(query, [...values, id])[0];
  }
}

// Create a new class for a specific table
class UserModel extends BaseModel {
  constructor() {
    super("users");
  }
}
