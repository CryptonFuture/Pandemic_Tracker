const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'pandemic_tracker_secret_2024', { expiresIn: '30d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({
      name, email, password,
      role: role === 'admin' ? 'viewer' : (role || 'viewer'), // prevent self-admin
      phone
    });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;
