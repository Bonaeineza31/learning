require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3032;
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Connection error:', err));

app.use('/api/contact', contactRoutes);

app.listen(port, (err) => {
  if (err) {
    console.log('Server not started');
  } else {
    console.log('Server started at: ' + port);
  }
});

module.exports = app;
