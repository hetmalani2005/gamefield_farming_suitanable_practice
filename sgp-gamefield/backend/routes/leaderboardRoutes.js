const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/leaderboard
// Query params: village, crop, groupBy (village|district|state)
router.get('/', async (req, res) => {
  try {
    const { village, crop, groupBy } = req.query;
    
    // If groupBy is provided, we return an aggregated leaderboard
    if (groupBy && ['village', 'district', 'state'].includes(groupBy.toLowerCase())) {
      const field = `farmData.location.${groupBy.toLowerCase()}`;
      
      const aggregateQuery = [
        { $match: { [field]: { $ne: null, $ne: '' } } },
        {
          $group: {
            _id: `$${field}`,
            totalXP: { $sum: '$xp' },
            farmerCount: { $sum: 1 },
            avgXP: { $avg: '$xp' }
          }
        },
        { $sort: { totalXP: -1 } },
        { $limit: 20 }
      ];

      const results = await User.aggregate(aggregateQuery);
      return res.json(results.map((r, i) => ({
        _id: r._id,
        name: r._id, // Use the region name as the 'name' for the UI
        xp: r.totalXP,
        farmerCount: r.farmerCount,
        avgXP: Math.round(r.avgXP),
        rank: i + 1,
        isRegion: true,
        regionType: groupBy
      })));
    }

    let query = {};
    
    if (village) {
      query['farmData.location.village'] = new RegExp(`^${village}$`, 'i');
    }
    
    if (crop) {
      // Improved crop matching with trim and case-insensitivity
      const cropRegex = new RegExp(`^${crop.trim()}$`, 'i');
      query.$or = [
        { 'farmData.cropType': cropRegex },
        { 'selectedCrop': cropRegex }
      ];
    }


    const users = await User.find(query)
      .select('name firstName lastName xp level badges farmData sustainabilityScore completedMissions currentBadge createdAt')
      .sort({ xp: -1 })
      .limit(50);

    const leaderboard = users.map((u, i) => ({
      _id: u._id,
      name: u.name,
      firstName: u.firstName,
      lastName: u.lastName,
      xp: u.xp,
      level: u.level,
      badges: u.badges,
      sustainabilityScore: u.sustainabilityScore,
      missionsCompleted: u.completedMissions?.length || 0,
      currentBadge: u.currentBadge?.title ? u.currentBadge : (require('../utils/badgeHelper').getBadgeByXP(u.xp)),
      farmData: {
        cropType: u.farmData?.cropType || u.selectedCrop,
        soilType: u.farmData?.soilType || u.soilType,
        location: u.farmData?.location
      },
      rank: i + 1,
      rewards: getRewardsForRank(i + 1)
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ message: err.message });
  }
});

const getRewardsForRank = (rank) => {
  if (rank === 1) return [
    { type: 'certificate', label: 'Champion Certificate' },
    { type: 'toolkit', label: '🧰 Farming Toolkit' },
    { type: 'discount', label: '🌱 20% Seed Discount' },
    { type: 'cash', label: '💰 ₹5,000 Cash Reward' }
  ];
  if (rank === 2) return [
    { type: 'certificate', label: 'Excellence Certificate' },
    { type: 'cash', label: '💰 ₹2,500 Cash Reward' }
  ];
  if (rank === 3) return [
    { type: 'certificate', label: 'Merit Certificate' },
    { type: 'cash', label: '💰 ₹1,000 Cash Reward' }
  ];
  return [];
};

module.exports = router;
