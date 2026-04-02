const User = require('../models/User');
const Mission = require('../models/Mission');
const staticMissions = require('../seeds/missionData');

/**
 * Personalized farming analysis generator (RULE-BASED)
 */
const generateAnalysis = async (req, res) => {
  try {
    const { cropType, soilType, season } = req.body;
    const userId = req.user?.id;

    if (!cropType || !soilType || !season) {
      return res.status(400).json({ success: false, message: 'cropType, soilType, and season are required' });
    }

    console.log(`Generating Rule-Based Analysis for ${cropType} in ${soilType} soil during ${season}`);

    // Precomputed Rule-Based Analysis
    const ruleBasedAnalysis = {
      summary: `A comprehensive sustainable farming strategy for ${cropType} cultivation in ${soilType} soil during the ${season} season.`,
      sustainabilityScore: 82,
      techniques: [
        {
          title: "Organic Fertilizer Mix",
          description: "Use a combination of Vermicompost and Neem cake to nourish the soil.",
          steps: ["Prepare the mixture in 4:1 ratio.", "Apply near the root zone.", "Cover with a thin layer of soil."],
          benefits: ["Zero chemical residue", "Improves soil micro-flora"],
          xpReward: 50,
          difficulty: "Easy",
          category: "Organic",
          estimatedTime: "2 hours"
        },
        {
          title: "Integrated Pest Management",
          description: `Specific pest deterrents for ${cropType} using local biological controls.`,
          steps: ["Install yellow sticky traps.", "Identify common pests early.", "Use Dashparni Ark if infestation is spotted."],
          benefits: ["Cost-effective", "Safe for beneficial insects"],
          xpReward: 70,
          difficulty: "Medium",
          category: "IPM",
          estimatedTime: "1 hour"
        }
      ],
      cropInsights: {
        expectedYieldIncrease: "12-18%",
        waterSavingPotential: "25%",
        warnings: [`Watch out for excess moisture in ${soilType} soil during ${season}.`]
      },
      seasonalTips: [
        `Adjust planting depth based on early ${season} temperature.`,
        "Keep the farm surroundings clean to avoid rodent issues."
      ],
      governmentSchemes: [
        { name: "PKVY (Paramparagat Krishi Vikas Yojana)", benefit: "Support for organic clusters", eligibility: "Small and marginal farmers" }
      ]
    };

    // Filter Missions (Rule-Based)
    const filteredMissions = staticMissions.filter(m => {
      const matchCrop = m.cropType.toLowerCase() === 'any' || m.cropType.toLowerCase() === cropType.toLowerCase();
      const matchSoil = m.soilType.toLowerCase() === 'any' || m.soilType.toLowerCase() === soilType.toLowerCase();
      const matchSeason = m.season.toLowerCase() === 'any' || m.season.toLowerCase() === season.toLowerCase();
      return matchCrop && matchSoil && matchSeason;
    });

    const selectedMissions = filteredMissions.sort(() => 0.5 - Math.random()).slice(0, 4);

    if (userId) {
      // Save missions to DB
      const mappedMissions = selectedMissions.map(m => ({
        ...m,
        isAI: false,
        cropType,
        soilType,
        season
      }));

      const savedMissions = await Mission.insertMany(mappedMissions);
      
      // Update User
      await User.findByIdAndUpdate(userId, {
        $set: {
          selectedCrop: cropType,
          soilType,
          season,
          'farmData.lastAnalysis': new Date(),
          missions: savedMissions.map(m => m._id)
        }
      });
      
      return res.status(200).json({
        success: true,
        analysis: ruleBasedAnalysis,
        missions: savedMissions
      });
    }

    // Response for guest users or verification
    res.status(200).json({ 
      success: true, 
      analysis: ruleBasedAnalysis, 
      missions: selectedMissions 
    });

  } catch (err) {
    console.error("Rule-Based Analysis major error:", err.message);
    res.status(500).json({ success: false, message: "Rule-Based Analysis failed: " + err.message });
  }
};

/**
 * COMPONENT: Mission generator (LEGACY / SPECIFIC)
 */
const generateMission = async (req, res) => {
  try {
    const { crop, soil, season } = req.body;
    
    const filtered = staticMissions.filter(m => (m.cropType === 'any' || m.cropType === crop));
    const selection = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);

    return res.json({ success: true, data: { missions: selection } });

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { generateAnalysis, generateMission };
