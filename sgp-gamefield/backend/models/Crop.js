const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  season: { type: String, enum: ['Kharif', 'Rabi', 'Zaid'], required: true },
  category: { type: String, enum: ['Vegetables', 'Fruits', 'Grains', 'Cash Crops'], required: true },
  idealSoil: String,
  waterRequirement: String,
  seasonDuration: String,
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
