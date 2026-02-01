import pg from 'pg';
const { Client } = pg;
import dotenv from 'dotenv';

dotenv.config();

const createDatabase = async () => {
  // First connect to postgres database to create our database
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Connect to default postgres database
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'ripro805',
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if database exists
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'mindbridge_db']
    );

    if (checkDb.rows.length === 0) {
      // Create database
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'mindbridge_db'}`);
      console.log(`✅ Database '${process.env.DB_NAME || 'mindbridge_db'}' created`);
    } else {
      console.log(`ℹ️  Database '${process.env.DB_NAME || 'mindbridge_db'}' already exists`);
    }

    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Database creation error:', error.message);
    if (client) await client.end();
    return false;
  }
};

createDatabase().then(() => {
  console.log('🎉 Database setup complete!');
  process.exit(0);
}).catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
