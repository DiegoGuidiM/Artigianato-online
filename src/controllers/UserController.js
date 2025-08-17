const express = require('express');
const app = express();
const User = require('../models/User');
const UserRepository = require('../repositories/UserRepository');
const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function register(req, res) {
    try {
        const { name, surname, email, password, role } = req.body;
        crypto.hashPassword(password);
        const user = new User(null, name, surname, email, password, role);
        const userRepository = new UserRepository();

        //verifico che l'utente non esista già
        const existingUser = await userRepository.getUserByEmail(email);
        if(existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({Error: 'User already exists'});
        }

        await userRepository.insertUser(user);
        res.status(201).json(user);
        res.send({Success: 'User created successfully'});
        console.log('User created successfully:', user);
        return user;
    } catch (error) {
        res.status(500).json({Error: 'Registration failed' });
        console.error('Error during registration:', error);
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        crypto.hashPassword(password);
        const userRepository = new UserRepository();
        const user = await userRepository.getUserByEmail(email);
        if(!user || user.password !== password) {
            console.log('Invalid email or password:', email);
            return res.status(401).json({Error: 'Invalid email or password'});
        }
        else {
            res.status(200).json({Success: 'Login successful', user});
            console.log('User logged in successfully:', user);
        }
    } catch (error) {
        res.status(500).json({Error: 'Login failed'});
        console.error('Error during login:', error);
    }
}


