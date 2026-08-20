import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
