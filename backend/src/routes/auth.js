const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function sanitizeUserRow(row){
  return {
    id_user: row.id_user,
    name: row.name,
    surname: row.surname,
    email: row.email,
    role: row.role
  };
}

function isValidEmail(email){
  return typeof email === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
function isValidPassword(pw){
  return typeof pw === 'string' && pw.length >= 8;
}
function normalizeRole(role){
  if(role === 'host') return 'host';
  return 'client';
}

// POST /api/register
router.post('/register', async (req, res) => {
  try{
    const { name, surname, email, password, role } = req.body || {};
    if(!name || !surname || !isValidEmail(email) || !isValidPassword(password)){
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const normRole = normalizeRole(role);

    const exists = await query('SELECT 1 FROM users WHERE email=$1', [email]);
    if(exists.rowCount > 0){
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const insert = await query(
      `INSERT INTO users(name, surname, email, password, role)
       VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [name, surname, email, hash, normRole]
    );

    const user = sanitizeUserRow(insert.rows[0]);
    return res.status(201).json({ user });
  }catch(e){
    console.error('register error', e);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body || {};
    if(!isValidEmail(email) || typeof password !== 'string'){
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const row = await query('SELECT * FROM users WHERE email=$1', [email]);
    if(row.rowCount === 0){
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const userRow = row.rows[0];
    const ok = await bcrypt.compare(password, userRow.password);
    if(!ok){
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { sub: String(userRow.id_user), role: userRow.role, email: userRow.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({ token, user: sanitizeUserRow(userRow) });
  }catch(e){
    console.error('login error', e);
    return res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
