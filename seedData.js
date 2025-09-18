const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

dotenv.config();

const Customer = require('./models/customerModel');
const Product = require('./models/productModel');
const Sale = require('./models/salesModel');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.error('MongoDB Connection Error:', err));

async function seedDatabase() {
  try {
    // Clear existing data
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});

    // ----- Customers -----
    const customers = [];
    const regions = ['North', 'South', 'East', 'West'];
    for (let i = 0; i < 20; i++) {
      customers.push(new Customer({
        name: faker.person.fullName(),
        region: regions[Math.floor(Math.random() * regions.length)],
        type: Math.random() > 0.5 ? 'Individual' : 'Business'
      }));
    }
    await Customer.insertMany(customers);

    // ----- Products -----
    const categories = ['Electronics', 'Fashion', 'Home', 'Sports'];
    const products = [];
    for (let i = 0; i < 10; i++) {
      products.push(new Product({
        name: faker.commerce.productName(),
        category: categories[Math.floor(Math.random() * categories.length)],
        price: parseFloat(faker.commerce.price())
      }));
    }
    await Product.insertMany(products);

    // ----- Sales -----
    const sales = [];
    for (let i = 0; i < 100; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const totalRevenue = product.price * quantity;
      const saleDate = faker.date.between({
        from: new Date('2023-01-01'),
        to: new Date('2025-01-01')
      });

      sales.push(new Sale({
        customer: customer._id,
        product: product._id,
        quantity,
        totalRevenue,
        saleDate
      }));
    }
    await Sale.insertMany(sales);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
}

seedDatabase();
