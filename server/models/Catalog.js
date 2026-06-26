const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
  productCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ url: String, publicId: String, isPrimary: Boolean }],
  dimensions: { height: String, width: String, weight: String },
  materials: [String],
  colors: [{ name: String, hexCode: String }],
  pricing: {
    basePrice: { type: Number, required: true },
    bulkPricing: [{ minQty: Number, maxQty: Number, pricePerUnit: Number }],
    currency: { type: String, default: 'INR' },
  },
  moq: { type: Number, default: 1 },
  availability: { type: String, enum: ['in_stock', 'made_to_order', 'out_of_stock'], default: 'in_stock' },
  leadTime: String,
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

catalogSchema.index({ name: 'text', description: 'text', productCode: 'text', tags: 'text' });

module.exports = mongoose.model('Catalog', catalogSchema);
