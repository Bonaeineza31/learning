import bcrypt from 'bcrypt';
import User from '../models/Login.js';

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