const crops = [
  // Kharif
  { name: 'Rice', season: 'Kharif', category: 'Grains', idealSoil: 'Clayey / Loamy', waterRequirement: 'High (1000-1500mm)', seasonDuration: '100-150 Days', imageUrl: 'rice.jpg' },
  { name: 'Maize', season: 'Kharif', category: 'Grains', idealSoil: 'Well-drained Loamy', waterRequirement: 'Medium (500-800mm)', seasonDuration: '90-120 Days', imageUrl: 'maize.jpg' },
  { name: 'Cotton', season: 'Kharif', category: 'Cash Crops', idealSoil: 'Black Cotton Soil', waterRequirement: 'Medium', seasonDuration: '150-180 Days', imageUrl: 'cotton.jpg' },
  { name: 'Tomato', season: 'Kharif', category: 'Vegetables', idealSoil: 'Loamy', waterRequirement: 'Medium', seasonDuration: '90-120 Days', imageUrl: 'tomato.jpg' },
  
  // Rabi
  { name: 'Wheat', season: 'Rabi', category: 'Grains', idealSoil: 'Well-drained Loamy', waterRequirement: 'Moderate', seasonDuration: '120-150 Days', imageUrl: 'wheat.jpg' },
  { name: 'Mustard', season: 'Rabi', category: 'Cash Crops', idealSoil: 'Sandy Loam', waterRequirement: 'Low', seasonDuration: '100-120 Days', imageUrl: 'mustard.jpg' },
  { name: 'Onion', season: 'Rabi', category: 'Vegetables', idealSoil: 'Loamy', waterRequirement: 'Medium', seasonDuration: '120-150 Days', imageUrl: 'onion.jpg' },
  { name: 'Apple', season: 'Rabi', category: 'Fruits', idealSoil: 'Loamy', waterRequirement: 'Moderate', seasonDuration: 'Perennial', imageUrl: 'apple.jpg' },

  // Zaid
  { name: 'Watermelon', season: 'Zaid', category: 'Fruits', idealSoil: 'Sandy Loam', waterRequirement: 'High', seasonDuration: '80-100 Days', imageUrl: 'watermelon.jpg' },
  { name: 'Cucumber', season: 'Zaid', category: 'Vegetables', idealSoil: 'Loamy', waterRequirement: 'High', seasonDuration: '60-80 Days', imageUrl: 'cucumber.jpg' },
  { name: 'Sugarcane', season: 'Zaid', category: 'Cash Crops', idealSoil: 'Deep Loam', waterRequirement: 'Very High', seasonDuration: '12-18 Months', imageUrl: 'sugarcane.jpg' }
];

module.exports = crops;
