import express from 'express';
import pool from '../config/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all support resources
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, language = 'en' } = req.query;

    let query = 'SELECT * FROM support_resources';
    const params = [];

    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }

    query += ' ORDER BY available_24_7 DESC, title_en ASC';

    const result = await pool.query(query, params);

    // Format response based on language
    const resources = result.rows.map(resource => ({
      id: resource.id,
      title: language === 'bn' ? resource.title_bn : resource.title_en,
      description: language === 'bn' ? resource.description_bn : resource.description_en,
      phone: resource.phone,
      category: resource.category,
      available247: resource.available_24_7
    }));

    res.json({ resources });
  } catch (error) {
    console.error('Get support resources error:', error);
    res.status(500).json({ error: 'Failed to get support resources' });
  }
});

// Get specific support resource
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;

    const result = await pool.query(
      'SELECT * FROM support_resources WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const resource = result.rows[0];
    res.json({
      id: resource.id,
      title: language === 'bn' ? resource.title_bn : resource.title_en,
      description: language === 'bn' ? resource.description_bn : resource.description_en,
      phone: resource.phone,
      category: resource.category,
      available247: resource.available_24_7
    });
  } catch (error) {
    console.error('Get support resource error:', error);
    res.status(500).json({ error: 'Failed to get support resource' });
  }
});

export default router;
