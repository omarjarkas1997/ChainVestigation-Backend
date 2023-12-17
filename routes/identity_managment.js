require('dotenv').config();
const express = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Check if JWT_SECRET is provided
if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET || "hello world";

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed to the next middleware
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

function createToken(user) {
    const payload = { id: user._id, roles: user.roles };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Utility function to create the response user object
function createTokenizedUser(user, token) {
    return {
        _firstName: user.firstName,
        _lastName: user.lastName,
        _email: user.email,
        _roles: user.roles,
        _token: token
    };
}

router.post('/register', async (req, res) => {
    const { _lastName: lastName, _firstName: firstName, _email: email, _password: password, _confirmPassword: confirmPassword, _roles: roles } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }
    if (!email || !password || !firstName || !lastName || !roles) {
        return res.status(400).json({ message: 'Email, password, first name, last name, and roles are required.' });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        user = new User({ firstName, lastName, email, password, roles });
        await user.save();
        const token = createToken(user);
        res.status(201).json({ user: createTokenizedUser(user, token) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { _email: email, _password: password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }

        const isValidPassword = await user.checkPassword(password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = createToken(user);
        res.status(201).json({ user: createTokenizedUser(user, token) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});




module.exports = router;