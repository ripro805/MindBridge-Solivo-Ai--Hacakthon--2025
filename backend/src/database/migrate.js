import pool from '../config/database.js';

const createTables = async () => {
  try {
    console.log('🔄 Starting database migration...');

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        language VARCHAR(10) DEFAULT 'en',
        theme VARCHAR(20) DEFAULT 'light',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Consent settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS consent_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        data_collection BOOLEAN DEFAULT false,
        anonymous_sharing BOOLEAN DEFAULT false,
        on_device_processing BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Consent settings table created');

    // Check-ins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS check_ins (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        entry_type VARCHAR(20) NOT NULL,
        text_entry TEXT,
        voice_transcript TEXT,
        voice_file_path VARCHAR(500),
        video_file_path VARCHAR(500),
        mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
        sentiment VARCHAR(20),
        stress_level VARCHAR(20),
        concerns TEXT[],
        recommendations TEXT[],
        risk_level VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Check-ins table created');

    // Mood trends table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mood_trends (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        average_mood DECIMAL(3,2),
        check_in_count INTEGER DEFAULT 0,
        UNIQUE(user_id, date)
      );
    `);
    console.log('✅ Mood trends table created');

    // Support resources table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS support_resources (
        id SERIAL PRIMARY KEY,
        title_en VARCHAR(255) NOT NULL,
        title_bn VARCHAR(255) NOT NULL,
        description_en TEXT,
        description_bn TEXT,
        phone VARCHAR(50),
        category VARCHAR(50),
        available_24_7 BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Support resources table created');

    // Insert default support resources
    await pool.query(`
      INSERT INTO support_resources (title_en, title_bn, description_en, description_bn, phone, category, available_24_7)
      VALUES 
        ('National Mental Health Helpline', 'জাতীয় মানসিক স্বাস্থ্য হেল্পলাইন', 'Free 24/7 mental health support', '২৪/৭ বিনামূল্যে মানসিক স্বাস্থ্য সহায়তা', '09678771771', 'emergency', true),
        ('Kaan Pete Roi', 'কান পেতে রই', 'Emotional support helpline', 'আবেগজনিত সহায়তা হেল্পলাইন', '01779554391', 'counseling', false),
        ('Moner Bondhu', 'মনের বন্ধু', 'Mental health counseling service', 'মানসিক স্বাস্থ্য পরামর্শ সেবা', '01844335544', 'counseling', false),
        ('NIMH Bangladesh', 'এনআইএমএইচ বাংলাদেশ', 'National Institute of Mental Health', 'জাতীয় মানসিক স্বাস্থ্য ইনস্টিটিউট', '01711111111', 'professional', false)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Default support resources inserted');

    // Admin users table (for dashboard)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Admin users table created');

    // User sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(500) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ User sessions table created');

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
      CREATE INDEX IF NOT EXISTS idx_check_ins_created_at ON check_ins(created_at);
      CREATE INDEX IF NOT EXISTS idx_mood_trends_user_date ON mood_trends(user_id, date);
    `);
    console.log('✅ Indexes created');

    console.log('🎉 Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

createTables();
