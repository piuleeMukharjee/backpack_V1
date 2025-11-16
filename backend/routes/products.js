const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Product = require('../models/Product');

const uploadDir = path.join(__dirname, '..', 'uploads');
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function(req,file,cb){ cb(null, uploadDir); },
  filename: function(req,file,cb){ cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage });

router.get('/', async (req,res) => {
  const products = await Product.find().populate('seller','username');
  res.json(products);
});

router.get('/:id', async (req,res) => {
  const p = await Product.findById(req.params.id).populate('seller','username');
  if(!p) return res.status(404).json({ error:'Not found' });
  res.json(p);
});

router.post('/', auth, upload.single('image'), async (req,res) => {
  try{
    if(req.user.role !== 'seller' && req.user.role !== 'admin') return res.status(403).json({ error:'Forbidden' });
    const { title, description } = req.body;
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    if(isNaN(price) || isNaN(stock)) return res.status(400).json({ error:'Price and stock must be numbers' });
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const product = await Product.create({ title, description, price, stock, image, seller: req.user.id });
    const pop = await product.populate('seller','username');
    res.json(pop);
  }catch(e){ res.status(400).json({ error: e.message }); }
});

router.put('/:id', auth, upload.single('image'), async (req,res) => {
  try{
    const p = await Product.findById(req.params.id);
    if(!p) return res.status(404).json({ error:'Not found' });
    if(req.user.role === 'seller' && String(p.seller) !== String(req.user.id)) return res.status(403).json({ error:'Forbidden' });
    const data = req.body;
    if(req.file) data.image = `/uploads/${req.file.filename}`;
    Object.assign(p, data);
    await p.save();
    res.json(p);
  }catch(e){ res.status(400).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req,res) => {
  try{
    const p = await Product.findById(req.params.id);
    if(!p) return res.status(404).json({ error:'Not found' });
    if(req.user.role === 'seller' && String(p.seller) !== String(req.user.id)) return res.status(403).json({ error:'Forbidden' });
    await p.remove();
    res.json({ success: true });
  }catch(e){ res.status(400).json({ error: e.message }); }
});

module.exports = router;
