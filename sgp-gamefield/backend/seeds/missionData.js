/**
 * Static Mission Data for Rule-Based Generation
 * Categories must match: 'Irrigation', 'Soil', 'Organic', 'Rotation', 'Eco'
 */
module.exports = [
  {
    title: "Compost Application",
    description: "Apply 2-3 inches of organic compost around the base of your plants.",
    steps: [
      { number: 1, content: "Clear weeds from around the plant base." },
      { number: 2, content: "Spread compost evenly, avoiding direct contact with the stem." },
      { number: 3, content: "Lightly water the area." }
    ],
    toolsRequired: ["Shovel", "Watering Can"],
    benefits: ["Enriches soil nutrients", "Retains moisture"],
    xpReward: 50,
    category: "Organic",
    difficulty: "Easy",
    cropType: "any",
    soilType: "any",
    season: "any"
  },
  {
    title: "Drip Irrigation Setup",
    description: "Install or check drip irrigation for efficient water usage.",
    steps: [
      { number: 1, content: "Lay the drip lines near the crop rows." },
      { number: 2, content: "Check for leaks or clogged emitters." },
      { number: 3, content: "Test the system for 15 minutes." }
    ],
    toolsRequired: ["Drip Kit", "Pliers"],
    benefits: ["Saves 40% water", "Reduces weed growth"],
    xpReward: 80,
    category: "Irrigation",
    difficulty: "Medium",
    cropType: "any",
    soilType: "any",
    season: "summer"
  },
  {
    title: "Natural Pest Spray",
    description: "Create and use a Neem-based spray to deter pests naturally.",
    steps: [
      { number: 1, content: "Mix 5ml Neem oil in 1L of soap water." },
      { number: 2, content: "Spray on both sides of the leaves in early morning." },
      { number: 3, content: "Repeat every 7 days." }
    ],
    toolsRequired: ["Sprayer", "Neem Oil"],
    benefits: ["Pesticide-free food", "Protects beneficial insects"],
    xpReward: 60,
    category: "Organic",
    difficulty: "Easy",
    cropType: "Tomato",
    soilType: "any",
    season: "any"
  },
  {
    title: "Mulching for Moisture",
    description: "Apply straw or dried leaves around crops to keep the soil cool.",
    steps: [
      { number: 1, content: "Collect dry straw or leaves." },
      { number: 2, content: "Layer it around the crops (avoid the stem)." },
      { number: 3, content: "Ensure no light hits the direct soil." }
    ],
    toolsRequired: ["Straw/Leaves", "Gloves"],
    benefits: ["Prevents evaporation", "Suppresses weeds"],
    xpReward: 40,
    category: "Irrigation",
    difficulty: "Easy",
    cropType: "any",
    soilType: "Sandy",
    season: "summer"
  },
  {
    title: "Green Manure Sowing",
    description: "Sow Dhaincha or Sunnhemp to fix nitrogen in black soil.",
    steps: [
      { number: 1, content: "Prepare the soil bed nicely." },
      { number: 2, content: "Broadcast the green manure seeds." },
      { number: 3, content: "Wait 40 days before plowing it back into the soil." }
    ],
    toolsRequired: ["Seeds", "Plow"],
    benefits: ["Natural nitrogen source", "Improves soil structure"],
    xpReward: 100,
    category: "Soil",
    difficulty: "Hard",
    cropType: "any",
    soilType: "Black",
    season: "monsoon"
  },
  {
    title: "Soil Moisture Test",
    description: "Check if the soil needs water by using the finger test.",
    steps: [
      { number: 1, content: "Poke your finger 2 inches into the soil." },
      { number: 2, content: "If it feels dry, it's time to water." },
      { number: 3, content: "If damp soil sticks, wait for one more day." }
    ],
    toolsRequired: ["None"],
    benefits: ["Avoids overwatering", "Healthy root growth"],
    xpReward: 30,
    category: "Soil",
    difficulty: "Easy",
    cropType: "any",
    soilType: "any",
    season: "any"
  }
];
