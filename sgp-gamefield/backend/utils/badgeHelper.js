const badges = [
  { xpThreshold: 1000, title: 'Farming Champion', icon: '👑', color: 'gold' },
  { xpThreshold: 600, title: 'Expert Farmer', icon: '🌾', color: 'wheat' },
  { xpThreshold: 300, title: 'Smart Farmer', icon: '🚜', color: 'silver' },
  { xpThreshold: 150, title: 'Growing Farmer', icon: '🌿', color: 'lightgreen' },
  { xpThreshold: 50, title: 'Beginner Farmer', icon: '🌱', color: 'green' }
];

const getBadgeByXP = (xp) => {
  for (const badge of badges) {
    if (xp >= badge.xpThreshold) {
      return badge;
    }
  }
  return null; // 0-49 XP
};

const getAllBadges = () => {
  return badges;
};

module.exports = { getBadgeByXP, getAllBadges };
