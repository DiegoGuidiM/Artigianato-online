const db = require('../db');

function addLocation(location) {
    return db('location').insert(location); //per le insert equivale a "insert into location values (oggetto)"
};

function getLocationByName(name) {
    return db.select().from('location').where({ name: name });  //per le select equivale a "select * from location where name = nome"
}

function getLocations() {
    return db.select().from('location');
}

module.exports = {
    addLocation,
    getLocationByName,
    getLocations
};