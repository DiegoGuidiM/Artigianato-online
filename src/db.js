require('dotenv').config();
const knex = require('knex');

const db = knex({
  client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'coworkspace_db',
        port: 5432,
    }
});

module.exports = db;