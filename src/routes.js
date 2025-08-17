const express = require('express');
const router = express.Router();
const UserController = require('./controllers/UserController');
const LocationController = require('./controllers/LocationController');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/addLocations', LocationController.addLocation);
router.get('/getLocations', LocationController.getLocations);