const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Personal Info
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  googleId: { type: String, sparse: true },
  
  // Farm Profile (legacy)
  farmData: {
    cropType: { type: String, default: '' },
    irrigationType: { type: String, default: '' },
    soilType: { type: String, default: '' },
    totalFarms: { type: Number, default: 0 },
    farmSize: { type: Number, default: 0 },
    location: {
      state: { type: String, default: '' },
      district: { type: String, default: '' },
      village: { type: String, default: '' },
      coordinates: { lat: Number, lng: Number }
    },
    season: { type: String, enum: ['Kharif', 'Rabi', 'Zaid', ''], default: '' }
  },
  
  // Farm Profile (Top-level for AI missions)
  selectedCrop: { type: String, default: '' },
  soilType: { type: String, default: '' },
  season: { type: String, default: '' },
  
  // Missions
  missions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mission' }], // User-specific dynamic missions
  activeMissions: [{
    missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
    status: { type: String, enum: ['started', 'completed', 'verified'], default: 'started' },
    proofUrl: String,
    startedAt: { type: Date, default: Date.now }
  }],
  completedMissions: [{
    missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
    completedAt: { type: Date, default: Date.now },
    proofUrl: String,
    xpAwarded: Number
  }],
  
  // Gamification Stats
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  sustainabilityScore: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
  
  badges: [{
    id: String,
    name: String,
    image: String,
    description: String,
    unlockedAt: { type: Date, default: Date.now }
  }],
  
  currentBadge: {
    title: { type: String, default: '' },
    icon: { type: String, default: '' },
    unlockedAt: { type: Date }
  },
  
  rewards: [{
    rank: Number,
    type: String,
    description: String,
    awardedAt: { type: Date, default: Date.now },
    season: String
  }]
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
