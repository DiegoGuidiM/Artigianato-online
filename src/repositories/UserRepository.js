const pool = require('../db');
const User = require('../models/User');

async function insertUser(user) {
  try {
    const query = 'INSERT INTO users (name, surname, email, password, role) VALUES ($1, $2, $3, $4, $5)';
    const values = [user.name, user.surname, user.email, user.password, user.role];
    await pool.query(query, values);
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    const user = result.rows[0];
    return new User(user.id, user.name, user.surname, user.email, user.password, user.role);
  } catch (error) {
    console.error('Error retrieving user by email:', error);
    throw error;
  }
}

module.exports = {
  insertUser,
  getUserByEmail
};