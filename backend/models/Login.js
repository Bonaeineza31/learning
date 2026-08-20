import mongoose from 'mongoose';

const LoginSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmpassword: { type: String, required: false },
  phone: { type: String, required: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

export default mongoose.model('User', LoginSchema);
