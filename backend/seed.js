require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/genie';

async function seed(){
  await mongoose.connect(MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true });
  console.log('Connected to', MONGODB_URI);
  await User.deleteMany({});
  await Product.deleteMany({});

  const pass = await bcrypt.hash('password', 10);
  const admin = await User.create({ username:'admin', email:'admin@example.com', password: pass, role:'admin' });
  const seller = await User.create({ username:'piulee', email:'seller@example.com', password: pass, role:'seller' });
  const seller2 = await User.create({ username:'seller2', email:'seller2@example.com', password: pass, role:'seller' });
  const buyer = await User.create({ username:'buyer1', email:'buyer1@example.com', password: pass, role:'buyer' });

  const uploads = path.join(__dirname, 'uploads');
  if(!fs.existsSync(uploads)) fs.mkdirSync(uploads);

  // copy logo as sample product image if exists
  const logoSrc = path.join(__dirname, '..', 'frontend', 'public', 'logo.png');
  const sampleDest = path.join(uploads, 'sample.png');
  if(fs.existsSync(logoSrc)) fs.copyFileSync(logoSrc, sampleDest);

  await Product.create({ title:'Side Bag', description:'Compact side bag', price:900, stock:5, image: '/uploads/sample.png', seller: seller._id });
  await Product.create({ title:'Classic Backpack', description:'Daily backpack', price:799, stock:25, image: '/uploads/sample.png', seller: seller._id });
  await Product.create({ title:'Travel Duffel', description:'Large duffel bag', price:1299, stock:10, image: '/uploads/sample.png', seller: seller2._id });
  await Product.create({ title:'Mini Sling', description:'Light sling bag', price:499, stock:15, image: '/uploads/sample.png', seller: seller2._id });

  console.log('Seed complete. Users: admin/piulee/seller2/buyer1 (password: password)');
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1); });
