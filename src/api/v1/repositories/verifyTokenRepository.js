const getUserById = async id => {
  const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return user.rows?.[0];
};
