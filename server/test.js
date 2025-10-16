import query from './services/dbQuery.js';
export const clearAuthorizedTable = async () => {
  const sql = 'TRUNCATE TABLE authorized RESTART IDENTITY CASCADE';
  try {
    await query(sql);
    console.log('Authorized table cleared successfully.');
    return true;
  } catch (err) {
    console.error('Error clearing authorized table:', err);
    return false;
  }
};

clearAuthorizedTable();
