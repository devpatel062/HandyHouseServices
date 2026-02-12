const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample service data with location-based logic
const getLocationBasedRecommendations = (latitude, longitude, city, state) => {
  // Sample logic based on major cities
  const cityRecommendations = {
    'San Francisco': [
      { 
        name: "Earthquake Retrofitting", 
        icon: "🏠", 
        popularity: 95, 
        nearby: 8, 
        reason: "High seismic activity in Bay Area",
        price: "$2,500 - $8,000"
      },
      { 
        name: "Fog Window Cleaning", 
        icon: "🪟", 
        popularity: 88, 
        nearby: 12, 
        reason: "Frequent fog conditions",
        price: "$150 - $300"
      },
      { 
        name: "HVAC Maintenance", 
        icon: "🌡️", 
        popularity: 82, 
        nearby: 15, 
        reason: "Moderate climate control needs",
        price: "$200 - $500"
      }
    ],
    'Phoenix': [
      { 
        name: "AC Maintenance", 
        icon: "❄️", 
        popularity: 98, 
        nearby: 15, 
        reason: "Extreme heat conditions",
        price: "$150 - $400"
      },
      { 
        name: "Pool Service", 
        icon: "🏊", 
        popularity: 92, 
        nearby: 10, 
        reason: "Desert climate - year round pools",
        price: "$100 - $200/month"
      },
      { 
        name: "Solar Panel Cleaning", 
        icon: "☀️", 
        popularity: 85, 
        nearby: 8, 
        reason: "High solar panel usage",
        price: "$100 - $250"
      }
    ],
    'Boston': [
      { 
        name: "Heating Repair", 
        icon: "🔥", 
        popularity: 94, 
        nearby: 12, 
        reason: "Cold winters require reliable heating",
        price: "$200 - $600"
      },
      { 
        name: "Historic Home Restoration", 
        icon: "🏛️", 
        popularity: 78, 
        nearby: 6, 
        reason: "Many historic buildings",
        price: "$1,000 - $5,000"
      },
      { 
        name: "Snow Removal", 
        icon: "❄️", 
        popularity: 89, 
        nearby: 14, 
        reason: "Heavy winter snowfall",
        price: "$50 - $150 per service"
      }
    ],
    'New York': [
      { 
        name: "Apartment Cleaning", 
        icon: "🧹", 
        popularity: 91, 
        nearby: 20, 
        reason: "Dense urban living, busy lifestyles",
        price: "$100 - $300"
      },
      { 
        name: "HVAC Maintenance", 
        icon: "🌡️", 
        popularity: 85, 
        nearby: 15, 
        reason: "Varied climate, old buildings",
        price: "$200 - $500"
      },
      { 
        name: "Pest Control", 
        icon: "🐛", 
        popularity: 87, 
        nearby: 18, 
        reason: "Urban pest issues",
        price: "$150 - $400"
      }
    ],
    'Miami': [
      { 
        name: "Hurricane Prep", 
        icon: "🌪️", 
        popularity: 89, 
        nearby: 8, 
        reason: "Hurricane season preparation",
        price: "$300 - $1,200"
      },
      { 
        name: "Pool Maintenance", 
        icon: "🏊", 
        popularity: 95, 
        nearby: 18, 
        reason: "Year-round swimming weather",
        price: "$80 - $150/month"
      },
      { 
        name: "Mold Remediation", 
        icon: "🏠", 
        popularity: 83, 
        nearby: 10, 
        reason: "High humidity levels",
        price: "$500 - $2,000"
      }
    ],
    'Seattle': [
      { 
        name: "Gutter Cleaning", 
        icon: "🌧️", 
        popularity: 93, 
        nearby: 14, 
        reason: "Heavy rainfall year-round",
        price: "$120 - $250"
      },
      { 
        name: "Roof Repair", 
        icon: "🏠", 
        popularity: 87, 
        nearby: 10, 
        reason: "Wet climate causes roof issues",
        price: "$300 - $1,500"
      },
      { 
        name: "Window Sealing", 
        icon: "🪟", 
        popularity: 81, 
        nearby: 12, 
        reason: "Rain protection",
        price: "$200 - $600"
      }
    ],
    'Chicago': [
      { 
        name: "Snow Removal", 
        icon: "❄️", 
        popularity: 96, 
        nearby: 16, 
        reason: "Heavy snowfall and wind",
        price: "$40 - $120 per service"
      },
      { 
        name: "Heating Service", 
        icon: "🔥", 
        popularity: 92, 
        nearby: 12, 
        reason: "Extremely cold winters",
        price: "$180 - $500"
      },
      { 
        name: "Wind Damage Repair", 
        icon: "💨", 
        popularity: 79, 
        nearby: 9, 
        reason: "Strong city winds",
        price: "$400 - $2,000"
      }
    ],
    'Los Angeles': [
      { 
        name: "Pool Cleaning", 
        icon: "🏊", 
        popularity: 90, 
        nearby: 22, 
        reason: "Year-round warm weather",
        price: "$75 - $125/month"
      },
      { 
        name: "Earthquake Prep", 
        icon: "🏠", 
        popularity: 85, 
        nearby: 14, 
        reason: "High seismic activity",
        price: "$500 - $3,000"
      },
      { 
        name: "Drought Landscaping", 
        icon: "🌵", 
        popularity: 88, 
        nearby: 16, 
        reason: "Water conservation needs",
        price: "$1,200 - $5,000"
      }
    ],
    'Denver': [
      { 
        name: "Snow Removal", 
        icon: "❄️", 
        popularity: 88, 
        nearby: 11, 
        reason: "Mountain weather patterns",
        price: "$45 - $135 per service"
      },
      { 
        name: "Altitude HVAC", 
        icon: "🌡️", 
        popularity: 82, 
        nearby: 9, 
        reason: "High altitude climate challenges",
        price: "$250 - $600"
      },
      { 
        name: "Deck Maintenance", 
        icon: "🏠", 
        popularity: 86, 
        nearby: 13, 
        reason: "UV damage at high altitude",
        price: "$300 - $800"
      }
    ]
  };

  // Default recommendations for unknown cities
  const defaultRecommendations = [
    { 
      name: "Home Inspection", 
      icon: "🔍", 
      popularity: 85, 
      nearby: 8, 
      reason: "Regular maintenance is important",
      price: "$300 - $600"
    },
    { 
      name: "Cleaning Service", 
      icon: "🧹", 
      popularity: 90, 
      nearby: 12, 
      reason: "Keep your home fresh and clean",
      price: "$80 - $200"
    },
    { 
      name: "Handyman Service", 
      icon: "🔧", 
      popularity: 88, 
      nearby: 10, 
      reason: "General repairs and maintenance",
      price: "$50 - $150/hour"
    }
  ];

  return cityRecommendations[city] || defaultRecommendations;
};

// API endpoint for location-based recommendations
app.post('/api/recommendations/location', (req, res) => {
  try {
    const { latitude, longitude, city, state } = req.body;
    
    console.log(`Fetching recommendations for: ${city}, ${state} (${latitude}, ${longitude})`);
    
    // Get recommendations based on the city
    const recommendations = getLocationBasedRecommendations(latitude, longitude, city, state);
    
    res.json({
      success: true,
      location: {
        city,
        state,
        coordinates: { latitude, longitude }
      },
      recommendations
    });
  } catch (error) {
    console.error('Error fetching location recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  GET  /api/health`);
  console.log(`  POST /api/recommendations/location`);
});
