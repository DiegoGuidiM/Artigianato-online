const express = require('express');
const router = express.Router();
const { query } = require('../db');

// POST /api/payment/add/user/:id
router.post('/payment/add', async(req, res) => {
  try {
    const id_user = req.params.id;
    const data = req.body;
    const db_query = `
    INSERT INTO payment (id_user, id_booking, amount, method, status)
    VALUES ($1, $2, $3, $4, $5)
    `;
    await query(db_query, values);
    res.status(201).json('Payment succesfully created');
    const values = [id_user, data.id_booking, data.amount, data.method, data.status];
  } catch(error) {
    console.error('POST /payment/add error', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

// GET /api/payment/user/:id
router.get('/payment/user/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const db_query = `
    SELECT * FROM payment WHERE id_user = $1
    `;
    const values = [id];
    const payments = await query(db_query, values);
    if (payments.rowCount === 0) 
        return res.status(404).json({ error: 'Not found' });
    res.status(201).json(payments.rows);
  } catch(error) {
    console.error('GET /payment/user/:id error', error);
    res.status(500).json({ error: 'Internal error' });
  }
});