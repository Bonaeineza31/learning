const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
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
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ data: contacts });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
