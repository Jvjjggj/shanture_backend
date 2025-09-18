const Sale = require('../models/salesModel');
const Customer = require('../models/customerModel');
const Product = require('../models/productModel');

/**
 * Get my name
 */
const getMyName = async (req, res) => {
  res.json({ name: "Jakeer" });
};

/**
 * Get total revenue between two dates
 */
const getTotalRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log("📊 getTotalRevenue called with:", { startDate, endDate });

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const revenueResult = await Sale.aggregate([
      {
        $match: {
          saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalRevenue" },
          totalSales: { $sum: "$quantity" },
        },
      },
    ]);

    console.log("✅ getTotalRevenue result:", revenueResult);
    res.json(revenueResult[0] || { totalRevenue: 0, totalSales: 0 });
  } catch (err) {
    console.error("❌ Error in getTotalRevenue:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

/**
 * Get top-selling products
 */
const getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 5 } = req.query;
    console.log("📊 getTopProducts called with:", { startDate, endDate, limit });

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const topProducts = await Sale.aggregate([
      {
        $match: {
          saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "$product",
          totalRevenue: { $sum: "$totalRevenue" },
          totalQuantity: { $sum: "$quantity" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "products", // ⚠️ collection name must match DB
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          productId: "$product._id",
          name: "$product.name",
          category: "$product.category",
          price: "$product.price",
          totalRevenue: 1,
          totalQuantity: 1,
        },
      },
    ]);

    console.log("✅ getTopProducts result:", topProducts);
    res.json(topProducts || []);
  } catch (err) {
    console.error("❌ Error in getTopProducts:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

/**
 * Get sales per region
 */
const getSalesByRegion = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log("📊 getSalesByRegion called with:", { startDate, endDate });

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const salesByRegion = await Sale.aggregate([
      {
        $match: {
          saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $lookup: {
          from: "customers", // ⚠️ collection name must match DB
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $group: {
          _id: "$customer.region",
          totalRevenue: { $sum: "$totalRevenue" },
          totalSales: { $sum: "$quantity" },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    console.log("✅ getSalesByRegion result:", salesByRegion);
    res.json(salesByRegion || []);
  } catch (err) {
    console.error("❌ Error in getSalesByRegion:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = {
  getTotalRevenue,
  getTopProducts,
  getSalesByRegion,
  getMyName,
};
