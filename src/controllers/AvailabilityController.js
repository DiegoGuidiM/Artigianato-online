const express = require('express');
const Availability = require('../models/Availability');
const AvailabilityRepository = require('../repositories/AvailabilityRepository');

async function addAvailability(req, res) {
    try {
        const { location, space_type, date, start_time, end_time, available_seats } = req.body;
        const availability = new Availability(null, location, space_type, date, start_time, end_time, available_seats);
        const availabilityRepository = new AvailabilityRepository();
        
        //Check if availability already exists for the same location and date
        const existingAvailability = await availabilityRepository.getAvailabilityByLocationAndDate(location, date);
        if(existingAvailability) {
            console.log('Availability already exists for this location and date:', location, date);
            return res.status(409).json({Error: 'Availability already exists for this location and date'});
        }

        await availabilityRepository.addAvailability(availability);
        res.status(201).json({Success: 'Availability added successfully', availability});
        console.log('Availability added successfully:', availability);
    } catch(error) {
        res.status(500).json({Error: 'Failed to add availability'});
        console.error('Error adding availability:', error);
    }
}

async function checkAvailability(req, res) {
    try {
        const { location, date } = req.body;
        const availabilityRepository = new AvailabilityRepository();
        const result = await availabilityRepository.getAvailabilityByLocationAndDate(location, date);
        if(result) {
            res.status(200).json({Success: 'Availability found', result});
            console.log('Availability found:', result);
        } else {
            res.status(404).json({Error: 'No availability found for this location and date'});
            console.log('No availability found for this location and date:', location, date);
        }
    } catch(error) {
        res.status(500).json({Error: 'Failed to check availability'});
        console.error('Error checking availability: ', error);
    }
}

module.exports = {
    addAvailability,
    checkAvailability
};