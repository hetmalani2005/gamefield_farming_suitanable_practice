const User = require('../models/User');
const Mission = require('../models/Mission');
const staticMissions = require('../seeds/missionData');

/**
 * GENERATE MISSIONS - RULE-BASED FLOW (No AI, High Reliability)
 */
const generateMissions = async (req, res) => {
  try {
    const { cropType, soilType, season } = req.body;
    const userId = req.user.id;

    if (!cropType || !soilType || !season) {
      return res.status(400).json({ success: false, message: "cropType, soilType, and season are required" });
    }

    console.log(`Generating Rule-Based Missions for ${cropType} in ${soilType} soil during ${season}`);

    // Filtering logic for Rule-Based Missions
    const filteredMissions = staticMissions.filter(m => {
      const matchCrop = m.cropType.toLowerCase() === 'any' || m.cropType.toLowerCase() === cropType.toLowerCase();
      const matchSoil = m.soilType.toLowerCase() === 'any' || m.soilType.toLowerCase() === soilType.toLowerCase();
      const matchSeason = m.season.toLowerCase() === 'any' || m.season.toLowerCase() === season.toLowerCase();
      
      return matchCrop && matchSoil && matchSeason;
    });

    // Pick a random subset (3-5 missions)
    const shuffled = filteredMissions.sort(() => 0.5 - Math.random());
    const selectedMissions = shuffled.slice(0, 5);

    // If no filtered missions found, fallback to all 'any' 'any' 'any'
    if (selectedMissions.length === 0) {
      const fallback = staticMissions.filter(m => m.cropType === 'any' && m.soilType === 'any' && m.season === 'any');
      selectedMissions.push(...fallback.slice(0, 3));
    }

    // 🔥 ULTRA-DEFENSIVE MAPPING to fix Mongoose ValidationError
    const mappedMissions = selectedMissions.map(m => ({
      ...m,
      isAI: false, // Rule-Based
      xpReward: m.xpReward || 50,
      cropType,
      soilType,
      season,
      isTemplate: false 
    }));

    // Clear old missions (optional, but requested for strictly dynamic dashboard)
    // await Mission.deleteMany({ userId, isAI: true }); // We could do this if needed

    const savedMissions = await Mission.insertMany(mappedMissions);
    
    // Update user's suggested missions (REPLACING OLD ONES to ensure ONLY the fresh rule-based set is shown)
    await User.findByIdAndUpdate(userId, { 
      selectedCrop: cropType,
      soilType,
      season,
      $set: { missions: savedMissions.map(m => m._id) } 
    });

    res.status(200).json({ success: true, missions: savedMissions });
  } catch (error) {
    console.error('Rule-based mission generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('missions');
    
    // If user has no generated missions, provide real missions from DB (save them first if needed)
    if (!user.missions || user.missions.length === 0) {
      console.log("Providing real DB-backed default missions.");
      
      // Use existing rule-based logic to pick 3 random ones
      const selection = staticMissions.slice(0, 3);
      
      // Save these as real missions so they have valid ObjectIds
      const savedDefaults = await Mission.insertMany(selection.map(m => ({
        ...m,
        isAI: false,
        cropType: 'any',
        soilType: 'any',
        season: 'any'
      })));

      const missionIds = savedDefaults.map(m => m._id);
      
      // Update the user document safely since 'user' is populated
      await User.findByIdAndUpdate(userId, { $set: { missions: missionIds } });
      
      return res.status(200).json(savedDefaults);
    }
    
    res.status(200).json(user.missions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ message: 'Mission not found' });
    res.json(mission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const startMission = async (req, res) => {
  try {
    const { missionId } = req.body;
    const user = await User.findById(req.user.id);
    const alreadyActive = user.activeMissions.find(m => m.missionId.toString() === missionId);
    if (alreadyActive) return res.status(400).json({ message: 'Mission already started' });

    user.activeMissions.push({ missionId, status: 'started' });
    await user.save();
    res.json(user.activeMissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const completeMission = async (req, res) => {
  try {
    const { missionId, proofUrl: bodyProofUrl } = req.body;
    const proofUrl = req.file ? `/uploads/${req.file.filename}` : bodyProofUrl;
    const user = await User.findById(req.user.id);
    const mission = await Mission.findById(missionId);

    if (!mission) return res.status(404).json({ message: 'Mission not found' });
    user.activeMissions = user.activeMissions.filter(m => m.missionId.toString() !== missionId);

    const xp = (mission.xpPoints || mission.xpReward) || 50;
    user.completedMissions.push({ missionId, proofUrl: proofUrl || 'uploaded', xpAwarded: xp });
    user.xp += xp;
    user.level = Math.floor(user.xp / 1000) + 1;
    user.sustainabilityScore += 5;

    const { getBadgeByXP } = require('../utils/badgeHelper');
    const newBadge = getBadgeByXP(user.xp);
    
    if (newBadge && (!user.currentBadge || user.currentBadge.title !== newBadge.title)) {
      user.currentBadge = { title: newBadge.title, icon: newBadge.icon, unlockedAt: new Date() };
      const alreadyHas = user.badges.find(b => b.name === newBadge.title);
      if (!alreadyHas) {
        user.badges.push({
          name: newBadge.title,
          image: newBadge.icon,
          description: `Unlocked at ${user.xp} XP`,
          unlockedAt: new Date()
        });
      }
    }

    await user.save();

    if (req.io) {
      req.io.to(req.user.id).emit('xpUpdated', {
        xp: user.xp,
        level: user.level,
        sustainabilityScore: user.sustainabilityScore,
        badges: user.badges
      });
    }

    res.json({ user, message: 'Mission completed successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { generateMissions, getMissions, getMissionById, startMission, completeMission };
