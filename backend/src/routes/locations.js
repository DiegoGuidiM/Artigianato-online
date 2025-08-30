const express = require('express');
const router = express.Router();
const { query } = require('../db');

const MAJOR  = ['Milano','Roma','Torino','Bologna','Napoli','Firenze','Venezia','Genova'];
const MEDIUM = ['Verona','Padova','Bari','Catania','Palermo']; // default: 3
const MINOR  = ['Varese','Como','Trento','Treviso','Pisa'];

function limitForCity(city) {
  const c = (city || '').trim();
  if (MAJOR.includes(c)) return 5; // max 5 per grandi
  if (MINOR.includes(c)) return 2; // 1–2 per piccole → ne mostriamo 2 max
  return 3;                         // medie → 3
}

// GET /api/locations?city=Milano
router.get('/locations', async (req, res) => {
  try {
    const city = (req.query.city || '').trim();

    // senza city: mostro comunque una lista corta (es. landing)
    if (!city) {
      // Return all locations with main identifiers
      const rows = await query(`
        SELECT
          id_location,
          name,
          city
        FROM location
        ORDER BY name
      `);
      return res.json(rows.rows);
    }

    const limit = limitForCity(city);
    const rows = await query(`
      SELECT
        s.id_location           AS id,
        s.id_host,
        s.name,
        s.address,
        s.city,
        s.region,
        s.country,
        s.capacity,
        s.cover_image_url,
      FROM location s
      ORDER BY RANDOM()
      WHERE city LIKE $1
    `, [city, limit]);

    res.json(rows.rows);
  } catch (e) {
    console.error('GET /rooms error', e);
    res.status(500).json({ error: 'Internal error' });
  }
});

// GET /api/locations/:id
router.get('/locations/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

    const row = await query(`
      SELECT
        s.id_location            AS id,
        s.id_host,
        s.name,
        s.address,
        s.city,
        s.region,
        s.country,
        s.capacity,
        s.cover_image_url,
      FROM location s
      WHERE s.id_location = $1
    `, [id]);

    if (row.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(row.rows[0]);
  } catch (e) {
    console.error('GET /rooms/:id error', e);
    res.status(500).json({ error: 'Internal error' });
  }
});

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

module.exports = router;