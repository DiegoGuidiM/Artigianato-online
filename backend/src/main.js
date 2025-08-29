const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const path = require('path');
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

app.use(express.json());

// CORS setup from env
const ALLOWED = (process.env.CORS_ORIGINS || '').split(',').map(s=>s.trim()).filter(Boolean);
app.use(cors({
  origin: function(origin, cb){
    if(!origin) return cb(null, true); // allow same-origin / curl
    if(ALLOWED.length === 0 || ALLOWED.includes(origin)) return cb(null, true);
    return cb(new Error('CORS not allowed: ' + origin), false);
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false
}));

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Routes
app.get('/health', (req,res)=> res.json({ ok: true }));
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/rooms')); //rooms route

// Start
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

// subito dopo aver creato app:
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));
// così i file in backend/public/images/... saranno disponibili come /images/...
