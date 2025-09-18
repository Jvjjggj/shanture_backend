const mongoose = require('mongoose');

const analyticsReportSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  totalRevenue: Number,
  avgOrderValue: Number,
  ordersCount: Number,
  topProducts: Array,
  topCustomers: Array,
  revenueByRegion: Array
}, { timestamps: true });

module.exports = mongoose.model('AnalyticsReport', analyticsReportSchema);

