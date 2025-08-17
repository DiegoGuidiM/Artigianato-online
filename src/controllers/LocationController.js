const express = require('express');
const app = express();
const location = require('../models/Location');
const LocationRepository = require('../repositories/LocationRepository');

async function addLocation(req, res) {
    try {
        const { name, address, city, region, country, capacity } = req.body;
        const newLocation = new location(null, name, address, city, region, country, capacity);
        const locationRepository = new LocationRepository();

        // Controlla se la sede esiste già
        const existingLocation = await locationRepository.getLocationByName(name);
        if(existingLocation) {
            console.log('Location already exists:', name);
            return res.status(400).json({Error: 'Location already exists'});
        }

        // Aggiungi la nuova sede
        await locationRepository.addLocation(newLocation);
        res.status(201).json(newLocation);
        console.log('Location added successfully:', newLocation);
    } catch (error) {
        res.status(500).json({Error: 'Failed to add location'});
        console.error('Error adding location:', error);
    }
}

async function getLocations(req, res) {
    try {
        const locationRepository = new locationRepository();
        const locations = await locationRepository.getLocations();
        
        // Controlla se ci sono sedi
        if(locations.length == 0) {
            console.log('No locations found');
            return res.status(404).json({Error: 'No locations found'});
        }

        res.status(200).json(locations);
        console.log('Locations retrieved successfully:', locations);
    } catch(error) {
        res.status(500).json({Error: 'Failed to retrieve locations'});
        console.error('Error retrieving locations:', error);
    }
}

module.exports = {
    addLocation,
    getLocations
};