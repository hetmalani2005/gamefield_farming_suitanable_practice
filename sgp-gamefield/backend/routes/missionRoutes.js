const express = require('express');
const router = express.Router();
const { getMissions, getMissionById, startMission, completeMission, generateMissions } = require('../controllers/missionController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public or Protected routes
router.get('/', auth, getMissions);
router.get('/:id', getMissionById);

// Protected routes
router.post('/generate', auth, generateMissions);
router.post('/start', auth, startMission);
router.post('/complete', auth, upload.single('proof'), completeMission);

module.exports = router;
