const express = require('express');
const router = express.Router();
const { query } = require('../db');

// City “tiers” per decidere quanti risultati mostrare
const MAJOR  = ['Milano','Roma','Torino','Bologna','Napoli','Firenze','Venezia','Genova'];
const MEDIUM = ['Verona','Padova','Bari','Catania','Palermo'];
const MINOR  = ['Varese','Como','Trento','Treviso','Pisa'];

function limitForCity(city) {
  const c = (city || '').trim();
  if (MAJOR.includes(c)) return 5;   // grandi città
  if (MINOR.includes(c)) return 2;   // piccole
  return 3;                          // medie (default)
}

// GET /api/rooms?city=Milano
// Se city non è passata, ritorna una manciata random di spazi
router.get('/rooms', async (req, res) => {
  try {
    const city = (req.query.city || '').trim();

    if (!city) {
      const rows = await query(`
        SELECT
          s.id_space  AS id,
          s.id_host,
          s.city,
          s.max_guests,
          s.price_symbol,
          s.image_url
        FROM space s
        ORDER BY RANDOM()
        LIMIT 12
      `);
      return res.json(rows.rows);
    }

    const limit = limitForCity(city);
    const rows = await query(`
      SELECT
        s.id_space  AS id,
        s.id_host,
        s.city,
        s.max_guests,
        s.price_symbol,
        s.image_url
      FROM space s
      WHERE s.city ILIKE $1
      ORDER BY RANDOM()
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
        s.id_space  AS id,
        s.id_host,
        s.city,
        s.max_guests,
        s.price_symbol,
        s.image_url
      FROM space s
      WHERE s.id_space = $1
    `, [id]);

    if (row.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(row.rows[0]);
  } catch (e) {
    console.error('GET /rooms/:id error', e);
    res.status(500).json({ error: 'Internal error' });
  }
});

// POST /api/rooms/add/user/:id  (solo host)
// Body atteso: { id_space_type, city, max_guests, price_symbol, image_url?, description? }
router.post('/rooms/add/user/:id', async (req, res) => {
  try {
    const id_host = Number(req.params.id);
    if (!Number.isInteger(id_host)) {
      return res.status(400).json({ error: 'Invalid host id' });
    }

    const {
      id_space_type,
      city,
      max_guests = 4,
      price_symbol = '€€',
      image_url = null,
      description = null
    } = req.body || {};

    if (!id_space_type || !city || !String(city).trim()) {
      return res.status(400).json({ error: 'Missing required fields: id_space_type, city' });
    }

    // limite massimo 15 ospiti
    const safeMaxGuests = Math.min(Number(max_guests) || 4, 15);

    const values = [
      id_host,
      Number(id_space_type),
      String(city).trim(),
      safeMaxGuests,
      String(price_symbol || '€€').slice(0, 4),
      image_url || null,
      description || null
    ];

    const dbQuery = `
      INSERT INTO space (id_host, id_space_type, city, max_guests, price_symbol, image_url, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_space AS id
    `;

    const result = await query(dbQuery, values);
    res.status(201).json({ ok: true, id: result.rows[0].id });
  } catch (error) {
    console.error('POST /rooms/add/user/:id error', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

// GET /api/rooms/host_rooms/user/:id  (solo host)
router.get('/rooms/host_rooms/user/:id', async (req, res) => {
  try {
    const id_host = Number(req.params.id);
    if (!Number.isInteger(id_host)) {
      return res.status(400).json({ error: 'Invalid host id' });
    }

    const rooms = await query(
      `SELECT id_space AS id, id_host, city, max_guests, price_symbol, image_url
       FROM space
       WHERE id_host = $1
       ORDER BY created_at DESC`,
      [id_host]
    );

    if (rooms.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rooms.rows);
  } catch (error) {
    console.error('GET /rooms/host_rooms/user/:id error', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

// POST /api/rooms/add_fav/
router.post('/rooms/add_fav/', async (req, res) => {
  try {
    const data = req.body;
    const db_query = `INSERT INTO favorite_space (id_user, id_space) VALUES($1, $2)`;
    const values = [data.id_user, data.id_space];
    await query(db_query, values);
    res.status(201).json('Room successfully added to favorites!');
  } catch (error) {
    console.error('Error adding room to favorites:', error);
    res.status(500).json({ 'Error': 'internal server error' });
  }
});

// GET /api/rooms/get_favs/user/:id
router.get('/rooms/get_favs/user/:id', async (req, res) => {
  try {
    const id_user = req.params.id;
    const db_query = `SELECT *
      FROM space s JOIN favorite_space f ON s.id_space = f.id_space
      WHERE f.id_user = $1`;
    const values = [id_user];
    const result = await query(db_query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching favorite rooms', error);
    res.status(500).json({ 'Error': 'Internal server error' });
  }
});

module.exports = router;
