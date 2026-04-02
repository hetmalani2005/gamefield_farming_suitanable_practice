const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const farmers = [
  { name: "Sanjay Patil", phone: "9876543210", password: "password123", xp: 4850, level: 5, farmData: { location: { village: "Baramati", district: "Pune", state: "Maharashtra" } } },
  { name: "Anil Deshmukh", phone: "9876543211", password: "password123", xp: 4200, level: 4, farmData: { location: { village: "Nashik", district: "Nashik", state: "Maharashtra" } } },
  { name: "Vijay Pawar", phone: "9876543212", password: "password123", xp: 3500, level: 3, farmData: { location: { village: "Sangli", district: "Sangli", state: "Maharashtra" } } },
  { name: "Rahul Shinde", phone: "9876543213", password: "password123", xp: 3200, level: 3, farmData: { location: { village: "Pune", district: "Pune", state: "Maharashtra" } } }
];

const seedUsers = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agriquest';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    // Clear users (optional)
    // await User.deleteMany({ email: { $exists: false } }); // Only delete dummy users if possible
    
    await User.insertMany(farmers);
    console.log('Seeded ' + farmers.length + ' dummy farmers.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();
