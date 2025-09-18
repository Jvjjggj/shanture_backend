const Sale = require('../models/salesModel');
const Customer = require('../models/customerModel');
const Product = require('../models/productModel');

/**
 * Get total revenue between two dates
 */
const getTotalRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const revenueResult = await Sale.aggregate([
      {
        $match: {
          saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalRevenue' },
          totalSales: { $sum: '$quantity' }
        }
      }
    ]);

    res.json(revenueResult[0] || { totalRevenue: 0, totalSales: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get top-selling products
 */
const getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 5 } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const topProducts = await Sale.aggregate([
      { $match: { saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      { $group: { _id: '$product', totalRevenue: { $sum: '$totalRevenue' }, totalQuantity: { $sum: '$quantity' } } },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 0,
          productId: '$product._id',
          name: '$product.name',
          category: '$product.category',
          price: '$product.price',
          totalRevenue: 1,
          totalQuantity: 1
        }
      }
    ]);

    res.json(topProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get sales per region
 */
const getSalesByRegion = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const salesByRegion = await Sale.aggregate([
      { $match: { saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
      {
        $lookup: {
          from: 'customers',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $group: {
          _id: '$customer.region',
          totalRevenue: { $sum: '$totalRevenue' },
          totalSales: { $sum: '$quantity' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json(salesByRegion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getTotalRevenue,
  getTopProducts,
  getSalesByRegion
};
