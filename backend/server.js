const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true })); 

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://srinureddy1519:1234567890@cluster0.1omjvoe.mongodb.net/ecommerce';
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const contactRoutes = require('./routes/contact'); // ✅ Added Contact Route

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);  // ✅ Now it works!


// Default Route
app.get('/', (req, res) => {
  res.send('🚀 Welcome to Pessi Clothings API!');
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
