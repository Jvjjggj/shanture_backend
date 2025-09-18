// seedData.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Product = require("./models/productModel");
const Customer = require("./models/customerModel");
const Sale = require("./models/salesModel");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected for Seeding");

    // Clear old data
    await Product.deleteMany();
    await Customer.deleteMany();
    await Sale.deleteMany();

    console.log("🗑️ Old data cleared");

    // Insert Products
    const products = await Product.insertMany([
      { name: "Laptop", category: "Electronics", price: 1000 },
      { name: "Phone", category: "Electronics", price: 600 },
      { name: "Headphones", category: "Accessories", price: 100 },
      { name: "Shoes", category: "Fashion", price: 80 },
    ]);

    console.log("📦 Products seeded");

    // Insert Customers
    const customers = await Customer.insertMany([
      { name: "Alice", region: "North" },
      { name: "Bob", region: "South" },
      { name: "Charlie", region: "East" },
      { name: "Diana", region: "West" },
    ]);

    console.log("👤 Customers seeded");

    // Insert Sales
    const sales = [
      {
        customer: customers[0]._id,
        product: products[0]._id,
        quantity: 2,
        totalRevenue: 2000,
        saleDate: new Date("2025-09-05"),
      },
      {
        customer: customers[1]._id,
        product: products[1]._id,
        quantity: 3,
        totalRevenue: 1800,
        saleDate: new Date("2025-09-10"),
      },
      {
        customer: customers[2]._id,
        product: products[2]._id,
        quantity: 5,
        totalRevenue: 500,
        saleDate: new Date("2025-09-15"),
      },
      {
        customer: customers[3]._id,
        product: products[3]._id,
        quantity: 4,
        totalRevenue: 320,
        saleDate: new Date("2025-09-20"),
      },
    ];

    await Sale.insertMany(sales);

    console.log("💰 Sales seeded");

    console.log("✅ Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
}

seed();
