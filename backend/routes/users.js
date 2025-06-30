const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'sM9L7cMT2POZs1RuzBdAy-Z25QO3A4NMGIN2o6B2ROE';
const OTP_STORE = {}; // Temporary in-memory store

/**
 * 📌 REGISTER USER
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required!' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 📌 LOGIN with PASSWORD
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '20d' });

    res.status(200).json({ message: 'Login successful', user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 📌 SEND OTP to Email
 */
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    OTP_STORE[email] = otp;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERONE,
        pass: process.env.EMAIL_PASSONE
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERONE,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    });

    // Expire OTP in 5 minutes
    setTimeout(() => delete OTP_STORE[email], 5 * 60 * 1000);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('OTP error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

/**
 * 📌 LOGIN with OTP
 */
router.post('/login-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (OTP_STORE[email] !== otp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    delete OTP_STORE[email]; // Clear OTP after usage

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '20d' });

    res.status(200).json({ message: 'OTP login successful', user, token });
  } catch (err) {
    console.error('OTP Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
