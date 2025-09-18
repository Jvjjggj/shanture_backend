const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String },
  type: { type: String }, // 'Individual' or 'Business'
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
