const Crop = require('../models/Crop');

const getCropsBySeason = async (req, res) => {
  try {
    const { season } = req.query;
    const filter = season ? { season } : {};
    const crops = await Crop.find(filter);
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCropsBySeason };
