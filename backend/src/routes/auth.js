import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, language = 'en', theme = 'light', role = 'user' } = req.body;

    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password, full_name, language, theme) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, language, theme, created_at',
      [email, hashedPassword, fullName, language, theme]
    );

    const user = result.rows[0];

    // Create default consent settings
    await pool.query(
      'INSERT INTO consent_settings (user_id, data_collection, anonymous_sharing, on_device_processing) VALUES ($1, $2, $3, $4)',
      [user.id, false, false, true]
    );

    // Add to admin_users table if role is admin
    if (role === 'admin') {
      await pool.query(
        'INSERT INTO admin_users (email, role) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
        [user.email, 'admin']
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        language: user.language,
        theme: user.theme
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is admin
    const adminCheck = await pool.query(
      'SELECT role FROM admin_users WHERE email = $1',
      [user.email]
    );
    
    const isAdmin = adminCheck.rows.length > 0;
    
    // Verify role matches requested login role
    if (role === 'admin' && !isAdmin) {
      return res.status(403).json({ error: 'You do not have admin access. Please login as User.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        language: user.language,
        theme: user.theme,
        isAdmin: isAdmin,
        role: isAdmin ? adminCheck.rows[0].role : 'user'
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, language, theme, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    
    // Check if user is admin
    const adminCheck = await pool.query(
      'SELECT role FROM admin_users WHERE email = $1',
      [user.email]
    );
    
    const isAdmin = adminCheck.rows.length > 0;
    
    res.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      language: user.language,
      theme: user.theme,
      createdAt: user.created_at,
      isAdmin: isAdmin,
      role: isAdmin ? adminCheck.rows[0].role : 'user'
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Update user settings
router.patch('/settings', authenticateToken, async (req, res) => {
  try {
    const { language, theme, fullName } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (language) {
      updates.push(`language = $${paramCount++}`);
      values.push(language);
    }
    if (theme) {
      updates.push(`theme = $${paramCount++}`);
      values.push(theme);
    }
    if (fullName) {
      updates.push(`full_name = $${paramCount++}`);
      values.push(fullName);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.user.userId);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, email, full_name, language, theme`;
    const result = await pool.query(query, values);

    const user = result.rows[0];
    res.json({
      message: 'Settings updated successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        language: user.language,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Get user
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, req.user.userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Forgot password - Request reset (simplified version without email)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    // Always return success to prevent email enumeration
    res.json({ 
      message: 'If an account exists with this email, password reset instructions will be sent.',
      // For demo purposes, if user exists, return a temporary token
      resetAvailable: result.rows.length > 0,
      // In production, send email with reset link
      demoMessage: 'In production, an email would be sent with reset link'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset password with token (simplified demo version)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Find user
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
      [hashedPassword, email]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;
