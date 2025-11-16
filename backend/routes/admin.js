const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

router.get('/inventory', auth, async (req,res) => {
  if(req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const products = await Product.find().populate('seller','username');
  res.json(products);
});

router.get('/users', auth, async (req,res) => {
  if(req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const users = await User.find().select('username role email');
  res.json(users);
});

router.delete('/users/:id', auth, async (req,res) => {
  try{
    if(req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const u = await User.findById(req.params.id);
    if(!u) return res.status(404).json({ error:'Not found' });
    await u.remove();
    res.json({ success:true });
  }catch(e){ res.status(400).json({ error: e.message }); }
});

router.get('/stats', auth, async (req,res) => {
  if(req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const totalProducts = await Product.countDocuments();
  const totalSellers = await User.countDocuments({ role: 'seller' });
  const totalOrders = await Order.countDocuments();
  res.json({ totalProducts, totalSellers, totalOrders });
});

module.exports = router;
