import query from './services/dbQuery.js';
export async function listTables() {
  try {
    const result = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tables = result.rows.map((row) => row.table_name);
    console.log('Tables in database:', tables);
    return tables;
  } catch (err) {
    console.error('Error listing tables:', err);
    return [];
  }
}

// Example usage:
listTables();
