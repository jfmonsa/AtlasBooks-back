import { pool } from "../../db.js";

/**
 * Executes the provided operation within a database transaction.
 * @param {Function} operation - The operation to be executed within the transaction.
 * @returns {Promise<void>}
 * @throws {Error} If the operation or transaction fails.
 */
export const withTransaction = async operation => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await operation(client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
