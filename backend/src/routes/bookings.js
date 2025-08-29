const express = require('express');
const router = express.Router();
const app = express();

// POST /:id/confirm
// -> Updates the booking status to "Confermata"
router.post('bookings/:id/confirm', async (req, res) => {
  const { id } = req.params;
  try {
    await query(`
      UPDATE booking
      SET id_booking_status = (
        SELECT id_booking_status FROM bookingstatus WHERE name = 'Confermata'
      ), updated_at = now()
      WHERE id_booking = $1
    `, [id]);

    res.json({ success: true, status: 'Confirmed' });
  } catch (e) {
    res.status(500).json({ error: 'Error confirming booking' });
  }
});

// POST /:id/cancel
// -> Updates the booking status to "Annullata"
router.post('bookings/:id/cancel', async (req, res) => {
  const { id } = req.params;
  try {
    await query(`
      UPDATE booking
      SET id_booking_status = (
        SELECT id_booking_status FROM bookingstatus WHERE name = 'Annullata'
      ), updated_at = now()
      WHERE id_booking = $1
    `, [id]);

    res.json({ success: true, status: 'Cancelled' });
  } catch (e) {
    res.status(500).json({ error: 'Error cancelling booking' });
  }
});

// GET /user/:id
// -> Retrieves all bookings for a user, with related availability, location, space and booking status
router.get('bookings/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(`
      SELECT 
        b.id_booking,
        b.booking_date,
        b.created_at,
        b.updated_at,
        bs.name AS booking_status,
        s.name AS space_name,
        s.image_url AS space_image,
        l.name AS location_name,
        l.city,
        a.date AS availability_date,
        a.start_time,
        a.end_time
      FROM booking b
      JOIN bookingstatus bs ON b.id_booking_status = bs.id_booking_status
      JOIN availability a   ON b.id_availability = a.id_availability
      JOIN location l       ON a.id_location = l.id_location
      JOIN space s          ON s.id_location = l.id_location
      WHERE b.id_user = $1
      ORDER BY b.created_at DESC
    `, [id]);

    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Error retrieving user bookings' });
  }
});

module.exports = router;