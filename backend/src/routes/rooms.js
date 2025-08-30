// backend/src/routes/rooms.js
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

// GET /api/rooms?city=Milano
router.get('/rooms', async (req, res) => {
  try {
    const city = (req.query.city || '').trim();

    // senza city: mostro comunque una lista corta (es. landing)
    if (!city) {
      const rows = await query(`
        SELECT
          s.id_space            AS id,
          s.id_host,
          s.city,
          s.max_guests,
          s.price_symbol,
          COALESCE(s.image_url, l.cover_image_url) AS image_url,
          l.city
        FROM space s
        JOIN location l ON l.id_location = s.id_location
        ORDER BY RANDOM()
        LIMIT 12
      `);
      return res.json(rows.rows);
    }

    const limit = limitForCity(city);
    const rows = await query(`
      SELECT
        s.id_space            AS id,
        s.id_host,
        s.city,
        s.max_guests,
        s.price_symbol,
        COALESCE(s.image_url, l.cover_image_url) AS image_url,
        l.city
      FROM space s
      JOIN location l ON l.id_location = s.id_location
      WHERE l.city ILIKE $1
      ORDER BY RANDOM()         -- così variano ad ogni richiesta
      LIMIT $2
    `, [city, limit]);

    res.json(rows.rows);
  } catch (e) {
    console.error('GET /rooms error', e);
    res.status(500).json({ error: 'Internal error' });
  }
});

// GET /api/rooms/:id
router.get('/rooms/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

    const row = await query(`
      SELECT
        s.id_space            AS id,
        s.id_host,
        s.city,
        s.max_guests,
        s.price_symbol,
        COALESCE(s.image_url, l.cover_image_url) AS image_url,
        l.city,
        l.cover_image_url
      FROM space s
      JOIN location l ON l.id_location = s.id_location
      WHERE s.id_space = $1
    `, [id]);

    if (row.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(row.rows[0]);
  } catch (e) {
    console.error('GET /rooms/:id error', e);
    res.status(500).json({ error: 'Internal error' });
  }
});

// POST /api/rooms/add - solo per host
router.post('/rooms/add/user/:id', async(req, res) => {
  try {
    const id_host = req.params.id;
    const data = req.body;
    const values = [data.id_location, id_host, data.id_space_type, data.city, data.max_guests, data.price_symbol, data.image_url];
    const db_query = `
    INSERT INTO space (id_location, id_host, id_space_type, city, max_guests, price_symbol, image_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await query(db_query, values);
    res.status(201).json('Room succesfully created');
  } catch(error) {
    console.error('POST /rooms/add/user/:id error', error);
    res.status(500).json({ error:'Internal error' });
  }
});

// GET /api/rooms/host_rooms/:id - solo per host
router.get('/rooms/host_rooms//user/:id', async(req, res) => {
  try {
    const data = req.params.id;
    const db_query = `
    SELECT * FROM space WHERE id_host = $1
    `;
    const values = [data];
    const rooms = await query(db_query, values);
    if (rooms.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rooms.rows);
  } catch(error) {
    console.error('GET /rooms/host_rooms/user/:id error', error);
    res.status(500).json({ error:'Internal error' });
  }
});

module.exports = router;
