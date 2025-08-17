const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.use(cors({origin: 'http://localhost'}));
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});