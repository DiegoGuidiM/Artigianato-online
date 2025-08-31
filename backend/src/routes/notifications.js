// backend/src/routes/notifications.js
const express = require('express');
const router = express.Router();
const { query } = require('../db'); // usa la connessione già esistente

// Funzione per creare una notifica
async function sendNotification(type, userId, data = {}) {
  let message = '';
  let sendAt = null; // opzionale, per reminder

  switch(type) {
    case 'payment_confirmed':
      message = `Your payment (ID: ${data.paymentId}) has been confirmed.`;
      break;
    case 'booking_confirmed_host':
      message = `User has booked your space (Booking ID: ${data.bookingId}).`;
      break;
    case 'booking_reminder':
      message = `Reminder: your booking (ID: ${data.bookingId}) is at ${data.time}.`;
      sendAt = data.time;
      break;
    case 'cancellation_user':
      message = `Your booking (ID: ${data.bookingId}) has been cancelled.`;
      break;
    case 'cancellation_host':
      message = `The booking (ID: ${data.bookingId}) has been cancelled by the user.`;
      break;
    default:
      throw new Error('Unknown notification type');
  }

  const sql = `
    INSERT INTO notification (id_user, type, message, send_at)
    VALUES ($1, $2, $3, $4)
  `;
  await query(sql, [userId, type, message, sendAt]);
}

// API: ottenere le notifiche di un utente
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const result = await query(
      `SELECT * FROM notification WHERE id_user=$1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

module.exports = { router, sendNotification };