const express = require('express');
const router = express.Router();
const {
  getTotalRevenue,
  getTopProducts,
  getSalesByRegion
} = require('../controllers/analyticsController');

router.get('/total-revenue', getTotalRevenue);
router.get('/top-products', getTopProducts);
router.get('/sales-by-region', getSalesByRegion);

module.exports = router;
