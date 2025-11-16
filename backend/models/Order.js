const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: Number, price: Number }],
  total: Number,
  status: { type: String, default: 'placed' }
}, { timestamps: true });
module.exports = mongoose.model('Order', OrderSchema);
