import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Auth from '../models/auth.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const errors = [];
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPassword = typeof password === 'string' ? password : '';
    const cleanRole = typeof role === 'string' ? role.trim().toLowerCase() : 'standard';

    if (!cleanName) {
      errors.push('Name is required');
    } else if (cleanName.length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (cleanName.length > 50) {
      errors.push('Name must be less than 50 characters');
    }

    if (!cleanEmail) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.push('Email is invalid');
    }

    if (!cleanPassword) {
      errors.push('Password is required');
    } else if (cleanPassword.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    if (cleanRole && !['admin', 'standard'].includes(cleanRole)) {
      errors.push('Role must be either admin or standard');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const existingUser = await Auth.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        errors: ['An account with this email already exists'],
      });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    const user = new Auth({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: cleanRole,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to register right now',
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await Auth.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch users',
    });
  }
};
