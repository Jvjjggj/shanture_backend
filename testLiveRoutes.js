const axios = require('axios');

const BASE_URL = 'https://shanture-backend-1-rz08.onrender.com';
const ANALYTICS_URL = `${BASE_URL}/api/analytics`;

async function testRoutes() {
  try {
    // ----- Ping -----
    const ping = await axios.get(`${BASE_URL}/ping`);
    console.log('/ping:', ping.data);

    // ----- Test Product -----
    const testProduct = await axios.get(`${BASE_URL}/test-product`);
    console.log('/test-product:', testProduct.data);

    // ----- Analytics Routes -----
    const getName = await axios.get(`${ANALYTICS_URL}/getName`);
    console.log('/getName:', getName.data);

    const totalRevenue = await axios.get(`${ANALYTICS_URL}/total-revenue`, {
      params: { startDate: '2025-01-01', endDate: '2025-09-18' }
    });
    console.log('/total-revenue:', totalRevenue.data);

    const topProducts = await axios.get(`${ANALYTICS_URL}/top-products`, {
      params: { startDate: '2025-01-01', endDate: '2025-09-18', limit: 5 }
    });
    console.log('/top-products:', topProducts.data);

    const salesByRegion = await axios.get(`${ANALYTICS_URL}/sales-by-region`, {
      params: { startDate: '2025-01-01', endDate: '2025-09-18' }
    });
    console.log('/sales-by-region:', salesByRegion.data);

  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

testRoutes();
