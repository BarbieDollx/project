const express = require('express');
const router = express.Router();

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const populateCart = (cart) =>
  cart.populate({
    path: 'items.product',
    select: 'name price image stock category user',
  });

// GET my cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await getOrCreateCart(req.user._id);
    cart = await populateCart(cart);

    // drop items whose product was deleted
    cart.items = cart.items.filter((item) => item.product);
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADD / increment
router.post('/items', protect, async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existing) {
      const nextQty = existing.qty + Number(qty);
      if (nextQty > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} in stock`,
        });
      }
      existing.qty = nextQty;
    } else {
      if (Number(qty) > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} in stock`,
        });
      }
      cart.items.push({ product: productId, qty: Number(qty) });
    }

    await cart.save();
    const populated = await populateCart(cart);
    res.status(201).json(populated);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE qty
router.put('/items/:productId', protect, async (req, res) => {
  try {
    const { qty } = req.body;
    const { productId } = req.params;

    if (!qty || qty < 1) {
      return res.status(400).json({ message: 'Qty must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} in stock`,
      });
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    item.qty = Number(qty);
    await cart.save();

    const populated = await populateCart(cart);
    res.json(populated);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// REMOVE one item
router.delete('/items/:productId', protect, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await cart.save();

    const populated = await populateCart(cart);
    res.json(populated);
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CLEAR cart
router.delete('/', protect, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;