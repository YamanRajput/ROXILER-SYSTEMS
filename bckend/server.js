// server.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://ashishnakhate2001:cEJzV9NCNVlcZ5WE@cluster0.ieqkl.mongodb.net/mern-challenge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Transaction model
const transactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// API to initialize the database
app.get('/api/init', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.deleteMany({});
    await Transaction.insertMany(response.data);
    res.send('Database initialized successfully.');
  } catch (error) {
    res.status(500).send('Error initializing database.');
  }
});

// List all transactions with search and pagination
app.get('/api/transactions', async (req, res) => {
  const { month, search = '', page = 1, perPage = 10 } = req.query;
  const monthNumber = new Date(`${month} 1, 2021`).getMonth() + 1;
  
  const query = {
    $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { price: isNaN(search) ? -1 : Number(search) },
    ],
  };

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));
    res.json(transactions);
  } catch (error) {
    res.status(500).send('Error fetching transactions.');
  }
});

// Get statistics
app.get('/api/statistics', async (req, res) => {
  const { month } = req.query;
  const monthNumber = new Date(`${month} 1, 2021`).getMonth() + 1;

  try {
    const transactions = await Transaction.find({
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
    });

    const totalSaleAmount = transactions.reduce((sum, item) => item.sold ? sum + item.price : sum, 0);
    const totalSoldItems = transactions.filter(item => item.sold).length;
    const totalNotSoldItems = transactions.filter(item => !item.sold).length;

    res.json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).send('Error fetching statistics.');
  }
});

// Get bar chart data
app.get('/api/bar-chart', async (req, res) => {
  const { month } = req.query;
  const monthNumber = new Date(`${month} 1, 2021`).getMonth() + 1;

  const priceRanges = {
    '0-100': 0,
    '101-200': 0,
    '201-300': 0,
    '301-400': 0,
    '401-500': 0,
    '501-600': 0,
    '601-700': 0,
    '701-800': 0,
    '801-900': 0,
    '901-above': 0,
  };

  try {
    const transactions = await Transaction.find({
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
    });

    transactions.forEach(item => {
      const price = item.price;
      if (price <= 100) priceRanges['0-100']++;
      else if (price <= 200) priceRanges['101-200']++;
      else if (price <= 300) priceRanges['201-300']++;
      else if (price <= 400) priceRanges['301-400']++;
      else if (price <= 500) priceRanges['401-500']++;
      else if (price <= 600) priceRanges['501-600']++;
      else if (price <= 700) priceRanges['601-700']++;
      else if (price <= 800) priceRanges['701-800']++;
      else if (price <= 900) priceRanges['801-900']++;
      else priceRanges['901-above']++;
    });

    res.json(priceRanges);
  } catch (error) {
    res.status(500).send('Error fetching bar chart data.');
  }
});

// Get pie chart data
app.get('/api/pie-chart', async (req, res) => {
  const { month } = req.query;
  const monthNumber = new Date(`${month} 1, 2021`).getMonth() + 1;

  try {
    const transactions = await Transaction.find({
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] },
    });

    const categoryCounts = transactions.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    res.json(categoryCounts);
  } catch (error) {
    res.status(500).send('Error fetching pie chart data.');
  }
});

// Combine data from the above APIs
app.get('/api/combined-data', async (req, res) => {
  const { month } = req.query;

  try {
    const [statistics, barChartData, pieChartData] = await Promise.all([
      axios.get('http://localhost:5000/api/statistics', { params: { month } }),
      axios.get('http://localhost:5000/api/bar-chart', { params: { month } }),
      axios.get('http://localhost:5000/api/pie-chart', { params: { month } }),
    ]);

    res.json({
      statistics: statistics.data,
      barChartData: barChartData.data,
      pieChartData: pieChartData.data,
    });
  } catch (error) {
    res.status(500).send('Error fetching combined data.');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});