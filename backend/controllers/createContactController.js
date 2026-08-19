const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
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
};
