import query from './services/dbQuery.js';
(async function run() {
  try {
    const result = await query('SELECT * FROM elements;');
    console.log(result.rows);
  } catch (err) {
    console.error('Error fetching elements:', err);
  }
})();
