require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const createContactRoutes = require('./routes/createContactRoutes');
const getContactRoutes = require('./routes/getContactRoutes');

const app = express();
const port = process.env.PORT || 3032;
const mongoURI = process.env.MONGODB_URI;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((error) => console.error('MongoDB connection error:', error.message));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/contact', createContactRoutes);
app.use('/api/contact', getContactRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.listen(port, () => {
  console.log('Server started at http://localhost:' + port);
});

module.exports = app;
