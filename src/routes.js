const express = require('express');
const router = express.Router();
const UserController = require('./controllers/UserController');
const LocationController = require('./controllers/LocationController');
const AvailabilityController = require('./controllers/AvailabilityController');


//User routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);


//Location routes
router.post('/addLocations', LocationController.addLocation);
router.get('/searchLocations', LocationController.searchLocations)
router.get('/getLocations', LocationController.getLocations);


//Availability routes
router.post('/addAvailability', AvailabilityController.addAvailability);