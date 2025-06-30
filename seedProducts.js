// server/seedProducts.js

const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Import the products data from the JSON file
const sampleProducts = require('./products.json');

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => console.error(err));

const seedDB = async () => {
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log('Products seeded successfully!');
};

seedDB().then(() => {
  mongoose.connection.close();
});
