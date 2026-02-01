import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    const email = 'admin@mindbridge.com';
    const password = 'admin123';
    const fullName = 'Admin User';

    console.log('🔄 Creating admin user...');

    // Check if admin user already exists in users table
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    let userId;
    if (existingUser.rows.length === 0) {
      // Create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const userResult = await pool.query(
        'INSERT INTO users (email, password, full_name) VALUES ($1, $2, $3) RETURNING id',
        [email, hashedPassword, fullName]
      );
      userId = userResult.rows[0].id;
      console.log('✅ Admin user created in users table');
    } else {
      userId = existingUser.rows[0].id;
      console.log('ℹ️  Admin user already exists in users table');
    }

    // Check if admin entry exists
    const existingAdmin = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
    
    if (existingAdmin.rows.length === 0) {
      // Create admin entry
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO admin_users (email, password, role) VALUES ($1, $2, $3)',
        [email, hashedPassword, 'admin']
      );
      console.log('✅ Admin entry created in admin_users table');
    } else {
      console.log('ℹ️  Admin entry already exists in admin_users table');
    }

    console.log('\n🎉 Admin user setup complete!');
    console.log('📧 Email: admin@mindbridge.com');
    console.log('🔑 Password: admin123');
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
