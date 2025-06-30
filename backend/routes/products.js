const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ✅ Get all products (with category & search filters)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get similar products based on category (excluding current product)
router.get('/similar/:id', async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const similarProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: req.params.id }, // Exclude current product
    }).limit(4); // Limit to 4 similar products

    res.status(200).json(similarProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new product (Admin)
router.post('/', async (req, res) => {
  try {
    const productData = req.body;
    const product = new Product(productData);
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a product by ID (Admin)
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a product by ID (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
