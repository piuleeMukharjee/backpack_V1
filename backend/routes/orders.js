const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

router.post('/', auth, async (req,res) => {
  try{
    if(req.user.role !== 'buyer') return res.status(403).json({ error:'Only buyers can place orders' });
    const { items, total } = req.body;
    const order = await Order.create({ buyer: req.user.id, items: items.map(i=>({ product: i.productId, qty: i.qty, price: i.price })), total });
    for(const it of items){
      const p = await Product.findById(it.productId);
      if(p){ p.stock = Math.max(0, p.stock - (it.qty || 1)); await p.save(); }
    }
    res.json(order);
  }catch(e){ res.status(400).json({ error: e.message }); }
});

router.get('/', auth, async (req,res) => {
  const filter = req.user.role === 'buyer' ? { buyer: req.user.id } : {};
  const orders = await Order.find(filter).populate('buyer','username').populate('items.product','title');
  res.json(orders);
});

module.exports = router;
