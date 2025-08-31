// backend/src/routes/spacetypes.js
const router = require('express').Router();
const { query } = require('../db');

// GET /api/spacetypes
// Ritorna l’elenco dei tipi di spazio (id, name, description)
router.get('/spacetypes', async (req, res) => {
  try {
    const r = await query(`
      SELECT id_space_type, name, description
      FROM spacetype
      ORDER BY name ASC
    `);
    res.json(r.rows);
  } catch (e) {
    console.error('GET /spacetypes error', e);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;