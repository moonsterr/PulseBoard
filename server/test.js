import query from './services/dbQuery.js';

(async function run() {
  try {
    const result = await query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);

    const tables = {};

    // Organize by table
    result.rows.forEach((row) => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = [];
      }
      tables[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
      });
    });

    // Print all tables and their columns
    for (const [table, columns] of Object.entries(tables)) {
      console.log(`Table: ${table}`);
      columns.forEach((col) => {
        console.log(`  - ${col.column}: ${col.type}`);
      });
    }
  } catch (err) {
    console.error('Error fetching tables and columns:', err);
  }
})();
