const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Contact = require("./models/Contact");

const app = express();

app.use(cors());
app.use(express.json());
const port = 3032;

app.listen(port, (err) => {
  if (err) {
    console.log("Server not started");
  } else {
    console.log("Server started at:" + " " + port);
  }
});

const mongoURI = 'mongodb://localhost:27017/contact_us';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Connection error:', err));

// POST 
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;

    // Validation
    const errors = [];

    if (!name || name.trim() === '') {
      errors.push('Name is required');
    }

    if (!email || email.trim() === '') {
      errors.push('Email is required');
    } else if (!email.includes('@')) {
      errors.push('Email is invalid');
    }

    if (!message || message.trim() === '') {
      errors.push('Message is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Save to database
    const contact = new Contact({ name, email, message, phone });
    await contact.save();

    res.status(201).json({ 
      message: 'Contact submitted successfully',
      data: contact 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET 
app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ data: contacts });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = app;
