const pool = require('../db');
const Location = require('../models/Location');

async function addLocation(location) {
    try {
        const query = 'INSERT INTO location (name, address, city, region, country, capacity) VALUES ($1, $2, $3, $4, $5, $6)';
        const values = [location.name, location.address, location.city, location.region, location.country, location.capacity];
        await pool.query(query, values);
    } catch (error) {
        console.error('Error adding location:', error);
        throw error;
    }
};

//la funzione prende in input un array di parametri in base
//ai quali verrà costruita la query
async function searchLocations(filters) {
    try {
        let query = 'SELECT * FROM location WHERE 1=1';
        let index = 1;

        if(filters.id) {
            query += ' AND id = $${index}';
            index++;
        }

        if(filters.id) {
            query += ' AND name LIKE $${index}';
            index++;
        }

        if(filters.city) {
            query += ' AND city LIKE $${index}';
            index++;
        }

        if(filters.region) {
            query += ' AND region LIKE $${index}';
            index++;
        }

        if(filters.country) {
            query += ' AND country LIKE $${index}';
            index++;
        }

        if(filters.capacity) {
            query += ' AND capacity >= $${index}';
            index++;
        }

        const result = await pool.query(query, Object.values(filters));
        return result.rows.map(loc => new Location(loc.id, loc.name, loc.address, loc.city, loc.region, loc.country, loc.capacity));

    } catch (error) {
        console.error('Error searching locations:', error);
        throw error;
    }
}

async function getLocations() {
    try {
        const query = 'SELECT * FROM location';
        const result = await pool.query(query);
        return result.map(loc => new Location(loc.id, loc.name, loc.address, loc.city, loc.region, loc.country, loc.capacity));
    }
    catch (error) {
        console.error('Error retrieving locations:', error);
        throw error;
    }
};

module.exports = {
    addLocation,
    searchLocations,
    getLocations
};