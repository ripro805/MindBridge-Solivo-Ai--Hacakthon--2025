import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mindbridge_db',
  password: 'ripro805',
  port: 5432,
});

async function addColumns() {
  try {
    console.log('🔧 Adding missing columns to check_ins table...');
    
    // Add voice_file_path column
    await pool.query(`
      ALTER TABLE check_ins 
      ADD COLUMN IF NOT EXISTS voice_file_path VARCHAR(500);
    `);
    console.log('✅ Added voice_file_path column');
    
    // Add video_file_path column
    await pool.query(`
      ALTER TABLE check_ins 
      ADD COLUMN IF NOT EXISTS video_file_path VARCHAR(500);
    `);
    console.log('✅ Added video_file_path column');
    
    console.log('🎉 Columns added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding columns:', error);
    process.exit(1);
  }
}

addColumns();
