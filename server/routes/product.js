const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// ==========================================
// GET ALL PRODUCTS
// Public route
// ==========================================
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});

// ==========================================
// GET MY PRODUCTS
// Protected route
// ==========================================
router.get('/my', protect, async (req, res) => {
  try {
    const products = await Product.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});

// ==========================================
// CREATE PRODUCT
// Protected route
// ==========================================
router.post('/', protect, async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);

    res.status(400).json({
      message: error.message
    });
  }
});
 
// Edit route
router.get('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});

module.exports = router;