// backend/src/routes/payment.js
const express = require('express');
const router = express.Router();
const { query } = require('../db');

// POST /api/payment/add/user/:id
// Body: { id_booking, amount, method, status }
router.post('/payment/add/user/:id', async (req, res) => {
  try {
    const id_user = Number(req.params.id);
    if (!Number.isInteger(id_user)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const { id_booking, amount, method, status } = req.body || {};
    const bookingId = Number(id_booking);
    const amt = Number(amount);

    if (!Number.isInteger(bookingId) || isNaN(amt)) {
      return res.status(400).json({ error: 'Missing or invalid fields: id_booking, amount' });
    }

    const values = [
      id_user,
      bookingId,
      amt,
      String(method || 'card'),
      String(status || 'pending')
    ];

    const db_query = `
      INSERT INTO payment (id_user, id_booking, amount, method, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_payment AS id
    `;

    const result = await query(db_query, values);
    return res.status(201).json({ ok: true, id: result.rows[0].id });
  } catch (error) {
    console.error('POST /payment/add/user/:id error', error);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// GET /api/payment/user/:id
router.get('/payment/user/:id', async (req, res) => {
  try {
    const id_user = Number(req.params.id);
    if (!Number.isInteger(id_user)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const db_query = `
      SELECT id_payment, id_user, id_booking, amount, payment_date, method, status
      FROM payment
      WHERE id_user = $1
      ORDER BY payment_date DESC, id_payment DESC
    `;
    const payments = await query(db_query, [id_user]);

    // 200 con lista (anche vuota)
    return res.json(payments.rows);
  } catch (error) {
    console.error('GET /payment/user/:id error', error);
    return res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
