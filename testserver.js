// testServer.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

// ----- Middleware -----
app.use(express.json());

// ----- Enable CORS for frontend -----
// If FRONTEND_URL is not set, allow all origins (for testing)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
  })
);

// ----- MongoDB Product Model -----
const Product = require('./models/productModel');

// ----- MongoDB Connection -----
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// ----- Simple test route -----
app.get('/ping', (req, res) => res.json({ status: 'ok', message: 'Server is live' }));

// ----- Test product route -----
app.get('/test-product', async (req, res, next) => {
  try {
    const existing = await Product.findOne({ name: 'Test Product' });
    if (existing)
      return res.json({ message: 'Product already exists', product: existing });

    const product = new Product({ name: 'Test Product', category: 'Demo', price: 99 });
    await product.save();
    res.json({ message: 'Product saved', product });
  } catch (err) {
    next(err);
  }
});

// ----- Analytics Routes -----
const analyticsRoutes = require('./routes/analyticsRoutes');
app.use('/api/analytics', analyticsRoutes); // Now all analytics routes are under /api/analytics

// ----- Serve React frontend (optional) -----
// Uncomment if you deploy frontend together with backend
/*
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});
*/

// ----- Global error handler -----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// ----- Start server -----
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
