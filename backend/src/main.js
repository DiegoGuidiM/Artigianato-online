const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const path = require('path');

// static (una sola volta)
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

// body parser (una sola volta, con limite)
app.use(express.json({ limit: '1mb' }));

// CORS from env
const ALLOWED = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // same-origin / curl
    if (ALLOWED.length === 0 || ALLOWED.includes(origin)) return cb(null, true);
    return cb(new Error('CORS not allowed: ' + origin));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false // metti true solo se usi cookie/sessions
}));

app.use(helmet());
app.use(morgan('dev'));

// Routes
app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/rooms'));
app.use('/api', require('./routes/bookings'));
app.use('/api', require('./routes/payment'));
app.use('/api', require('./routes/spacetypes'));
app.use('/api/notifications', require('./routes/notifications').router);


// Bootstrap & start
const { bootstrap } = require('./bootstrap');

(async () => {
  try {
    if (process.env.DB_BOOTSTRAP === 'true') {
      console.log('[DB] Bootstrapping schema…');
      await bootstrap();
      console.log('[DB] Schema OK');
    }
    const PORT = Number(process.env.PORT || 3000);
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('Startup error:', e);
    process.exit(1);
  }
})();

