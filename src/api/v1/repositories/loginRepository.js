export const getUserByNicknameOrEmail = async email => {
  const user = await pool.query(
    "SELECT * FROM users WHERE email = $1 or nickname = $1",
    [email]
  );
  return user.rows?.[0];
};
