import query from './dbQuery.js';
import bcrypt from 'bcrypt';

export const createUser = async ({ username, password, email, photo }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO users (username, password, email,photo) VALUES ($1, $2, $3, $4) RETURNING id, username,email`,
    [username, hashedPassword, email, photo]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0];
};

export const comparePasswords = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
export const getUserInfoService = async (userId) => {
  const result = await query(
    `SELECT username, photo FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0];
};
export const queryUsersService = async (name, currentUserId) => {
  if (!name || name.trim().length === 0) return [];

  const sql = `
    SELECT id, username, photo
    FROM users
    WHERE username ILIKE $1
    AND id != $2
    LIMIT 20
  `;
  const values = [`%${name}%`, currentUserId];

  try {
    const result = await query(sql, values);
    return result.rows;
  } catch (err) {
    console.error('queryUsersService error:', err);
    throw err;
  }
};
export const addAuthorizedUserService = async (userId, addUserId) => {
  const checkSql = `
    SELECT * FROM authorized
    WHERE user_id = $1 AND authorized_by = $2
  `;
  const insertSql = `
    INSERT INTO authorized (user_id, authorized_by)
    VALUES ($1, $2)
    RETURNING user_id, authorized_by
  `;
  const values = [addUserId, userId];

  try {
    const existing = await query(checkSql, values);
    if (existing.rows.length > 0) {
      return { message: 'User already authorized', already: true };
    }

    const result = await query(insertSql, values);
    return result.rows[0];
  } catch (err) {
    console.error('addAuthorizedUserService error:', err);
    return false;
  }
};

export const getAuthorizedByService = async (userId) => {
  const sql = `
    SELECT u.id, u.username, u.photo
    FROM authorized au
    JOIN users u ON au.authorized_by = u.id
    WHERE au.user_id = $1
  `;
  const values = [userId];

  try {
    const result = await query(sql, values);
    return result.rows; // array of users who authorized him
  } catch (err) {
    console.error('getAuthorizedByService error:', err);
    throw err;
  }
};
export const getAuthorizedUsersService = async (userId) => {
  try {
    const result = await query(
      `SELECT u.id, u.username, u.email, u.photo
       FROM authorized au
       JOIN users u ON au.user_id = u.id
       WHERE au.authorized_by = $1`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error in getAuthorizedUsersService:', error);
    throw error;
  }
};
export const updateUsernameService = async (userId, username) => {
  const check = await query(`SELECT 1 FROM users WHERE username = $1`, [
    username,
  ]);
  if (check.rows.length > 0) return 'username';
  const sql = `
    UPDATE users
    SET username = $1
    WHERE id = $2
    RETURNING id, username, email, photo
  `;
  const values = [username, userId];

  try {
    const result = await query(sql, values);
    console.log('hello something going on sir?');
    return result.rows[0]?.username || null;
  } catch (err) {
    console.error('updateUsernameService error:', err);
    throw err;
  }
};
