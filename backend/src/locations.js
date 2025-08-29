const express = require('express');
const router = express.Router();
const { query } = require('../db');

// POST /api/locations/add
router.post('/locations/add', async(req, res) => {
  try {
    const data = req.body;
    const db_query = `
    INSERT INTO location (name, address, city, region, country, capacity, cover_image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await query(db_query, data);
    res.status(201).json('Location succesfully created');
    console.log('Location added:', data);
  } catch(error) {
    console.error('POST /locations/add error', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

// GET /api/locations
router.get('/locations', async (req, res) => {
  try {

  } catch(error) {
    console.error('GET /locations error', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;