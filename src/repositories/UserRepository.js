const db = require('../db');

function insertUser(user) {
  return db('user').insert(user);
}

function getUserByEmail(email) {
  return db.select().from('user').where({ email: email });
}

module.exports = {
  insertUser,
  getUserByEmail
};