import bcrypt from 'bcryptjs';
import User from '../models/Register.js';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    const errors = [];
    const cleanUsername = typeof username === 'string' ? username.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPassword = typeof password === 'string' ? password : '';
    const cleanPhone = typeof phone === 'string' ? phone.replace(/\D/g, '').slice(0, 15) : '';

    if (!cleanUsername || cleanUsername.length < 3) errors.push('Username must be at least 3 characters');
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) errors.push('Valid email is required');
    if (!cleanPassword || cleanPassword.length < 8) errors.push('Password must be at least 8 characters');

    if (errors.length > 0) return res.status(400).json({ success: false, errors });

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(cleanPassword, salt);

    const user = new User({ username: cleanUsername, email: cleanEmail, password: hash, phone: cleanPhone || undefined });
    await user.save();

    return res.status(201).json({ success: true, message: 'Registered successfully', data: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
};
