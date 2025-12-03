// models/Image.js
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String },
  url: { type: String, required: true },
  size: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Image || mongoose.model('Image', ImageSchema);
