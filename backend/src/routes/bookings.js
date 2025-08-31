// backend/src/routes/bookings.js
const express = require('express');
const router = express.Router();
const { query } = require('../db');

// POST /api/bookings/:id/confirm
// Imposta lo stato della prenotazione a "Confermata"
router.post('/bookings/:id/confirm', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid booking id' });

  try {
    const result = await query(`
      UPDATE booking
      SET id_booking_status = (
        SELECT id_booking_status FROM bookingstatus WHERE LOWER(name) = LOWER('Confermata')
      ),
      updated_at = now()
      WHERE id_booking = $1
      RETURNING id_booking
    `, [id]);

    if (result.rowCount === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ ok: true, status: 'Confermata' });
  } catch (e) {
    console.error('POST /bookings/:id/confirm error', e);
    res.status(500).json({ error: 'Internal error' });
  }
});

// POST /api/bookings/:id/cancel
// Imposta lo stato a "Annullata"
router.post('/bookings/:id/cancel', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid booking id' });

  try {
    const result = await query(`
      UPDATE booking
      SET id_booking_status = (
        SELECT id_booking_status FROM bookingstatus WHERE LOWER(name) = LOWER('Annullata')
      ),
      updated_at = now()
      WHERE id_booking = $1
      RETURNING id_booking
    `, [id]);

    if (result.rowCount === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ ok: true, status: 'Annullata' });
  } catch (e) {
    console.error('POST /bookings/:id/cancel error', e);
    res.status(500).json({ error: 'Internal error' });
  }
});

// GET /api/bookings/user/:id
// Restituisce le prenotazioni dell'utente con info di availability e stato
router.get('/bookings/user/:id', async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId)) return res.status(400).json({ error: 'Invalid user id' });

  try {
    const result = await query(`
      SELECT 
        b.id_booking,
        b.booking_date,
        b.created_at,
        b.updated_at,
        bs.name AS booking_status,
        a.id_availability,
        a.date       AS availability_date,
        a.start_time,
        a.end_time,
        a.available_seats
      FROM booking b
      JOIN bookingstatus bs ON b.id_booking_status = bs.id_booking_status
      JOIN availability a   ON b.id_availability   = a.id_availability
      WHERE b.id_user = $1
      ORDER BY b.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (e) {
    console.error('GET /bookings/user/:id error', e);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;