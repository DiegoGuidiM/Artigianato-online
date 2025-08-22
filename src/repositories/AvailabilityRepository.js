const db = require('../db');
const Availability = require('../models/Availability');

async function addAvailability(availability) {
    try {
        const query = 'INSERT INTO availability (location_id, date, time_slot) VALUES ($1, $2, $3)';
        const values = [availability.locationId, availability.date, availability.timeSlot];
        await db.query(query, values);
    } catch (error) {
        console.error('Error adding availability:', error);
        throw error;
    }
};

async function getAvailabilitiesByLocation(location_id) {
    try {
        const query = 'SELECT * FROM availability WHERE location_id = $1';
        const values = [location_id];
        const result = await db.query(query, values);
        return result.rows.map(row => new Availability(row.id, row.location_id, row.date, row.time_slot));
    } catch(error) {
        console.error('Error retrieving availabilities:', error);
        throw error;
    }
};

async function getAvailabilityByLocationAndDate(location_id, date) {
    try {
        const query = 'SELECT * FROM availability WHERE location_id = $1 AND date = $2';
        const values = [location_id, date];
        const result = await db.query(query, values);
        return result.rows.map(row => new Availability(row.id, row.location_id, row.date, row.time_slot));
    } catch (error) {
        console.error('Error retrieving availability:', error);
        throw error;
    }
};

module.exports = {
    addAvailability,
    getAvailabilitiesByLocation,
    getAvailabilityByLocationAndDate
};