const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  listTitle: { type: String },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'easy', 'medium', 'hard'], default: 'Easy' },
  xpReward: { type: Number },
  xpPoints: { type: Number }, // For AI missions
  category: { type: String, enum: ['Irrigation', 'Organic', 'Rotation', 'Soil', 'Eco', 'General'], default: 'General' },
  targetSeasons: [String],
  targetCrops: [String],
  
  // AI Specific Metadata
  cropType: String,
  soilType: String,
  season: String,
  isAI: { type: Boolean, default: false },
  
  // Mission Detailed Content
  goal: String,
  steps: [{
    number: Number,
    content: String
  }],
  whyImportant: String,
  benefits: [String], // For AI missions
  requiredMaterials: [String],
  toolsRequired: [String], // For AI missions
  estimatedTime: String,
  tutorialVideo: String,
  videoTutorial: String, // For AI missions
  imageThumbnail: String,
  
  // Logic for unlocking/completion
  badgeReward: {
    id: String,
    name: String,
    image: String
  },
  badgeRewardText: String // For AI missions (text based reward)
}, { timestamps: true });

// Virtual to handle both key names if needed
missionSchema.virtual('xp').get(function() {
  return this.xpPoints || this.xpReward;
});

module.exports = mongoose.model('Mission', missionSchema);
