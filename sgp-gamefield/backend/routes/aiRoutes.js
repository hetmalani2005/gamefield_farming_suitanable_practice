const express = require("express");
const { generateAnalysis, generateMission } = require("../controllers/aiController");

const router = express.Router();

/**
 * Endpoint for full farming analysis (Dashboard)
 * Includes summary, techniques, govt schemes, etc.
 */
router.post("/generate-analysis", generateAnalysis);

/**
 * REAL FLOW: Dynamic Mission Generator
 * Suggests sustainable farming missions (tasks) for farmers.
 */
router.post("/generate-mission", generateMission);

module.exports = router;
