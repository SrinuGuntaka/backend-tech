const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

// Contact Form Route
router.post('/', async (req, res) => {
  const { name, email,mobile, message } = req.body;

  if (!name || !email || !mobile || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // ✅ Get from .env file
        pass: process.env.EMAIL_PASS   // ✅ Use App Passwords
      }
    });

    // Email Content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // ✅ Sends to your own email
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message. Try again later.' });
  }
});

module.exports = router;
