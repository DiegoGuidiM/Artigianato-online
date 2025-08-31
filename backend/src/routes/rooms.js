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

// BASE_URL per immagini statiche
const BASE_IMG = 'http://localhost:3000/images';

// GET /api/rooms?city=Milano
router.get('/rooms', async (req, res) => {
  try {
    const city = (req.query.city || '').trim();

    if (!city) {
      const rows = await query(`
        SELECT
          s.id_space  AS id,
          s.id_host,
          l.city,
          s.max_guests,
          s.price_symbol,
          CASE 
            WHEN s.image_url IS NOT NULL AND s.image_url <> '' 
            THEN $1 || '/' || s.image_url
            ELSE NULL
          END AS image_url
        FROM space s
        JOIN location l ON s.id_location = l.id_location
        ORDER BY RANDOM()
        LIMIT 12
      `, [BASE_IMG]);
      return res.json(rows.rows);
    }

    const limit = limitForCity(city);
    const rows = await query(`
      SELECT
        s.id_space  AS id,
        s.id_host,
        l.city,
        s.max_guests,
        s.price_symbol,
        CASE 
          WHEN s.image_url IS NOT NULL AND s.image_url <> '' 
          THEN $2 || '/' || s.image_url
          ELSE NULL
        END AS image_url
      FROM space s
      JOIN location l ON s.id_location = l.id_location
      WHERE l.city ILIKE $1
      ORDER BY RANDOM()
      LIMIT $3
    `, [city, BASE_IMG, limit]);

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
        COALESCE(s.name, l.name, 'Room') AS name,
        l.city,
        s.max_guests,
        s.price_symbol,
        CASE 
          WHEN s.image_url IS NOT NULL AND s.image_url <> '' 
          THEN $2 || '/' || s.image_url
          ELSE NULL
        END AS image_url,
        s.description
      FROM space s
      JOIN location l ON s.id_location = l.id_location
      WHERE s.id_space = $1
    `, [id, BASE_IMG]);

    if (row.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(row.rows[0]);
  } catch (e) {
    console.error('GET /rooms/:id error', e);
    res.status(500).json({ error: 'Internal error' });
  }
});

// POST /api/rooms/add/user/:id  (solo host)
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

    // Recupera la location corrispondente alla città
    let location = await query(`SELECT id_location FROM location WHERE city ILIKE $1 LIMIT 1`, [city]);
    if (location.rowCount === 0) {
      return res.status(400).json({ error: 'City not found in locations' });
    }
    const id_location = location.rows[0].id_location;

    // limite massimo 15 ospiti
    const safeMaxGuests = Math.min(Number(max_guests) || 4, 15);

    const values = [
      id_host,
      id_location,
      Number(id_space_type),
      String(city).trim(),
      safeMaxGuests,
      String(price_symbol || '€€').slice(0, 4),
      image_url || null, // <— salva solo "rooms/..." nel DB
      description || null
    ];

    const dbQuery = `
      INSERT INTO space (id_host, id_location, id_space_type, city, max_guests, price_symbol, image_url, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
      `SELECT 
         s.id_space AS id, 
         s.id_host, 
         l.city, 
         s.max_guests, 
         s.price_symbol,
         CASE 
           WHEN s.image_url IS NOT NULL AND s.image_url <> '' 
           THEN $2 || '/' || s.image_url
           ELSE NULL
         END AS image_url
       FROM space s
       JOIN location l ON s.id_location = l.id_location
       WHERE s.id_host = $1
       ORDER BY s.created_at DESC`,
      [id_host, BASE_IMG]
    );

    if (rooms.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rooms.rows);
  } catch (error) {
    console.error('GET /rooms/host_rooms/user/:id error', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

// POST /api/favorites/:id
router.post('/favorites/:id', async (req, res) => {
  try {
    const id_user = Number(req.body.id_user);
    const id_space = Number(req.params.id);

    if (!id_space || !id_user) return res.status(400).json({ error: 'Invalid user or space id' });

    await query(`
      INSERT INTO favourite_space (id_user, id_space)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [id_user, id_space]);

    res.status(201).json({ ok: true, message: 'Added to favorites' });
  } catch (error) {
    console.error('Error adding favourite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/rooms/get_favs/user/:id
router.get('/rooms/get_favs/user/:id', async (req, res) => {
  try {
    const id_user = Number(req.params.id);
    const result = await query(`
      SELECT
        s.id_space AS id,
        s.id_host,
        COALESCE(s.name, l.name, 'Room') AS name,
        l.city,
        s.max_guests,
        s.price_symbol,
        CASE 
          WHEN s.image_url IS NOT NULL AND s.image_url <> '' 
          THEN $2 || '/' || s.image_url
          ELSE NULL
        END AS image_url,
        s.description
      FROM space s
      JOIN favourite_space f ON s.id_space = f.id_space
      JOIN location l ON s.id_location = l.id_location
      WHERE f.id_user = $1
    `, [id_user, BASE_IMG]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching favourite rooms', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
