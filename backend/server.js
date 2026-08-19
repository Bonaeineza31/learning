const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Contact = require('./models/Contact');
const app = express();
const port = Number(process.env.PORT) || 3032;
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/contact_us';

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

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;

    const errors = [];
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanMessage = typeof message === 'string' ? message.trim() : '';
    const cleanPhone = typeof phone === 'string' ? phone.replace(/\D/g, '').slice(0, 10) : '';

    if (!cleanName) {
      errors.push('Name is required');
    }

    if (!cleanEmail) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.push('Email is invalid');
    }

    if (!cleanMessage) {
      errors.push('Message is required');
    }

    if (cleanPhone && cleanPhone.length !== 10) {
      errors.push('Phone number must be 10 digits when provided');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const contact = new Contact({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      phone: cleanPhone || undefined,
    });

    await contact.save();

    return res.status(201).json({
      success: true,
      message: 'Contact submitted successfully',
      data: contact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to save contact right now',
    });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch contact submissions',
    });
  }
});

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
