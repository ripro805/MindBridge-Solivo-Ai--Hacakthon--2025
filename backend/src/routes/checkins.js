import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { analyzeTextSentiment } from '../services/aiAnalysis.js';

const router = express.Router();

// Create new check-in
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { entryType, textEntry, voiceTranscript, voiceFilePath, videoFilePath } = req.body;
    const userId = req.user.userId;

    // Analyze content using AI service - combine all available content
    let combinedContent = '';
    if (textEntry) combinedContent += textEntry + ' ';
    if (voiceTranscript) combinedContent += voiceTranscript + ' ';
    
    // Enhanced analysis with voice and video metadata
    const analysis = await analyzeTextSentiment(combinedContent, {
      hasVoice: !!voiceFilePath,
      hasVideo: !!videoFilePath,
      entryType
    });

    // Insert check-in
    const result = await pool.query(
      `INSERT INTO check_ins 
       (user_id, entry_type, text_entry, voice_transcript, voice_file_path, video_file_path, mood_score, sentiment, stress_level, concerns, recommendations, risk_level) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [
        userId,
        entryType,
        textEntry || null,
        voiceTranscript || null,
        voiceFilePath || null,
        videoFilePath || null,
        analysis.moodScore,
        analysis.sentiment,
        analysis.stressLevel,
        analysis.concerns,
        analysis.recommendations,
        analysis.riskLevel
      ]
    );

    // Update mood trends
    const today = new Date().toISOString().split('T')[0];
    await pool.query(
      `INSERT INTO mood_trends (user_id, date, average_mood, check_in_count)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (user_id, date) 
       DO UPDATE SET 
         average_mood = (mood_trends.average_mood * mood_trends.check_in_count + $3) / (mood_trends.check_in_count + 1),
         check_in_count = mood_trends.check_in_count + 1`,
      [userId, today, analysis.moodScore]
    );

    res.status(201).json({
      message: 'Check-in recorded successfully',
      checkIn: result.rows[0],
      analysis: {
        sentiment: analysis.sentiment,
        stressLevel: analysis.stressLevel,
        moodScore: analysis.moodScore,
        concerns: analysis.concerns,
        recommendations: analysis.recommendations,
        riskLevel: analysis.riskLevel
      }
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Failed to record check-in' });
  }
});

// Get user's check-ins
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT * FROM check_ins WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM check_ins WHERE user_id = $1',
      [userId]
    );

    res.json({
      checkIns: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get check-ins error:', error);
    res.status(500).json({ error: 'Failed to get check-ins' });
  }
});

// Get specific check-in
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT * FROM check_ins WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Check-in not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get check-in error:', error);
    res.status(500).json({ error: 'Failed to get check-in' });
  }
});

export default router;
