const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  totalRevenue: { type: Number, required: true },
  saleDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
