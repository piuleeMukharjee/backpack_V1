const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secret = process.env.JWT_SECRET || 'change_this_secret';

router.post('/register', async (req,res) => {
  try{
    const { username, email, password, role } = req.body;
    if(!username || !password) return res.status(400).json({ error: 'username and password required' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, role });
    res.json({ id: user._id, username: user.username, role: user.role });
  }catch(e){
    res.status(400).json({ error: e.message });
  }
});

router.post('/login', async (req,res) => {
  try{
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, secret, { expiresIn: '7d' });
    res.json({ token, role: user.role, username: user.username });
  }catch(e){
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
