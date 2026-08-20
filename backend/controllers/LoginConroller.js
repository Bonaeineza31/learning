import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/Login.js';
import dotenv from 'dotenv';

export const RegisterUser = async (req, res) => {
  try {
    const { name, email, password, confirmpassword, phone } = req.body;
    if (!name || !email || !password || !confirmpassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    if (password !== confirmpassword ) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    const existingUser = await User.findOne({ email}); 
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword,phone });
    res.status(201).json({ 
        message: 'User registered successfully', 
        user:{id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone} });

  } catch (error) {
    console.error('Error occurred while registering user:', error);
    res.status(500).json({ message: 'Error occurred while registering user' });
  }
}

export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect Passowrd' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1hr' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });

  } catch (error) {
    console.error('Error occurred while logging in user:', error);
    res.status(500).json({ message: 'Error occurred while logging in' });
  }
}