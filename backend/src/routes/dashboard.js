import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get mood trends for dashboard
router.get('/mood-trends', authenticateToken, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT date, average_mood, check_in_count 
       FROM mood_trends 
       WHERE user_id = $1 AND date >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
       ORDER BY date ASC`,
      [userId]
    );

    res.json({
      trends: result.rows,
      period: `${days} days`
    });
  } catch (error) {
    console.error('Get mood trends error:', error);
    res.status(500).json({ error: 'Failed to get mood trends' });
  }
});

// Get dashboard summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get current wellness score (average of last 7 days)
    const wellnessResult = await pool.query(
      `SELECT AVG(average_mood) as wellness_score 
       FROM mood_trends 
       WHERE user_id = $1 AND date >= CURRENT_DATE - INTERVAL '7 days'`,
      [userId]
    );

    // Get total check-ins
    const checkInCountResult = await pool.query(
      'SELECT COUNT(*) as total FROM check_ins WHERE user_id = $1',
      [userId]
    );

    // Get recent check-ins
    const recentCheckInsResult = await pool.query(
      'SELECT * FROM check_ins WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    // Get risk level distribution
    const riskDistResult = await pool.query(
      `SELECT risk_level, COUNT(*) as count 
       FROM check_ins 
       WHERE user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY risk_level`,
      [userId]
    );

    // Calculate current risk level
    const latestCheckIn = await pool.query(
      'SELECT risk_level FROM check_ins WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    const wellnessScore = wellnessResult.rows[0].wellness_score 
      ? parseFloat(wellnessResult.rows[0].wellness_score).toFixed(1) 
      : null;

    res.json({
      wellnessScore: wellnessScore ? parseFloat(wellnessScore) : 0,
      totalCheckIns: parseInt(checkInCountResult.rows[0].total),
      recentCheckIns: recentCheckInsResult.rows,
      currentRiskLevel: latestCheckIn.rows[0]?.risk_level || 'unknown',
      riskDistribution: riskDistResult.rows
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({ error: 'Failed to get dashboard summary' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Mood statistics
    const moodStats = await pool.query(
      `SELECT 
        AVG(mood_score) as avg_mood,
        MIN(mood_score) as min_mood,
        MAX(mood_score) as max_mood
       FROM check_ins 
       WHERE user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '30 days'`,
      [userId]
    );

    // Sentiment distribution
    const sentimentDist = await pool.query(
      `SELECT sentiment, COUNT(*) as count 
       FROM check_ins 
       WHERE user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY sentiment`,
      [userId]
    );

    // Most common concerns
    const concernsResult = await pool.query(
      `SELECT UNNEST(concerns) as concern, COUNT(*) as count 
       FROM check_ins 
       WHERE user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY concern
       ORDER BY count DESC
       LIMIT 5`,
      [userId]
    );

    res.json({
      moodStatistics: {
        average: moodStats.rows[0].avg_mood ? parseFloat(moodStats.rows[0].avg_mood).toFixed(1) : 0,
        min: moodStats.rows[0].min_mood || 0,
        max: moodStats.rows[0].max_mood || 0
      },
      sentimentDistribution: sentimentDist.rows,
      topConcerns: concernsResult.rows
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

export default router;
