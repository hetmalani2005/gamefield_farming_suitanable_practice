const express = require('express');
const router = express.Router();
const { getCropsBySeason } = require('../controllers/cropController');

router.get('/', getCropsBySeason);

module.exports = router;
