import bcrypt from 'bcrypt';
import Auth from '../models/auth.js';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = [];
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPassword = typeof password === 'string' ? password : '';

    if (!cleanEmail) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.push('Email is invalid');
    }

    if (!cleanPassword) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const user = await Auth.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        errors: ['Invalid email or password'],
      });
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        errors: ['Invalid email or password'],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to login right now',
    });
  }
};
