const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Mission = require('../models/Mission');
const missionData = require('./missionData');
const Crop = require('../models/Crop');
const cropData = require('./cropData');

dotenv.config({ path: '../.env' });

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agriquest';
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    
    // Clear missions and crops
    await Mission.deleteMany({});
    await Crop.deleteMany({});
    
    // Insert new missions
    const insertedMissions = await Mission.insertMany(missionData);
    const insertedCrops = await Crop.insertMany(cropData);
    console.log(`Seeded ${insertedMissions.length} missions and ${insertedCrops.length} crops.`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
