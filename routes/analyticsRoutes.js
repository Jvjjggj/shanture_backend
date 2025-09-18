const express = require("express");
const router = express.Router();
const {
  getMyName,
  getTotalRevenue,
  getTopProducts,
  getSalesByRegion,
} = require("../controllers/analyticsController");

// ---- Simple test route ----
router.get("/getName", getMyName);

// ---- Analytics routes ----
router.get("/total-revenue", getTotalRevenue);   // ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get("/top-products", getTopProducts);    // ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&limit=5
router.get("/sales-by-region", getSalesByRegion); // ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

module.exports = router;
