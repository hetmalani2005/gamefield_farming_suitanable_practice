const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'agriquest_secret', { expiresIn: '30d' });
};

const safeUser = (user) => {
  const { getBadgeByXP } = require('../utils/badgeHelper');
  const badge = user.currentBadge?.title ? user.currentBadge : getBadgeByXP(user.xp);
  
  return {
    id: user._id,
    _id: user._id,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    farmData: user.farmData,
    xp: user.xp,
    level: user.level,
    badges: user.badges,
    currentBadge: badge,
    rewards: user.rewards,
    sustainabilityScore: user.sustainabilityScore,
    streak: user.streak,
    activeMissions: user.activeMissions,
    completedMissions: user.completedMissions,
    createdAt: user.createdAt
  };
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, firstName, lastName, email, phone, password, village, district, state } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    let user = await User.findOne({ phone });
    if (user) return res.status(400).json({ message: 'User with this phone number already exists' });

    if (email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) return res.status(400).json({ message: 'User with this email already exists' });
    }

    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim() || 'Farmer';

    user = new User({
      name: fullName,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email ? email.toLowerCase() : undefined,
      phone,
      password,
      farmData: {
        location: { village: village || '', district: district || '', state: state || '' }
      }
    });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    if (!password) return res.status(400).json({ message: 'Password is required' });
    if (!phone && !email) return res.status(400).json({ message: 'Phone or email is required' });

    let user;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = await User.findOne({ phone });
    }

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('activeMissions.missionId')
      .populate('completedMissions.missionId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(safeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { farmData, firstName, lastName, name, email, village, district, state } = req.body;
    
    const updates = {};
    if (farmData) updates.farmData = farmData;
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email.toLowerCase();
    
    // Handle location updates from top-level fields
    if (village || district || state) {
      updates['farmData.location'] = {
        ...(farmData?.location || {}),
        village: village || farmData?.location?.village || '',
        district: district || farmData?.location?.district || '',
        state: state || farmData?.location?.state || ''
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true })
      .populate('activeMissions.missionId')
      .populate('completedMissions.missionId');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(safeUser(user));
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };
