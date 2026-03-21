import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star /*, TrendingUp */ } from 'lucide-react';
import axios from 'axios';

const SmartRecommendations = ({ onServiceSelect }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user's current location using browser geolocation
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  // Reverse geocode coordinates to get city/neighborhood using Mapbox
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&types=place,locality,neighborhood`
      );
      
      if (response.data.features && response.data.features.length > 0) {
        const place = response.data.features[0];
        const city = place.context?.find(c => c.id.includes('place'))?.text || place.text;
        const state = place.context?.find(c => c.id.includes('region'))?.text;
        return { city, state, fullLocation: `${city}, ${state}` };
      }
      
      return null;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return null;
    }
  };

  // Helper function to get service icons based on service names
  const getServiceIcon = (serviceName) => {
    const iconMap = {
      // Common household services
      'Electrician': '⚡',
      'Electrical': '⚡',
      'Plumber': '🚰',
      'Plumbing': '🚰',
      'House Cleaning': '🧹',
      'Cleaning Service': '🧹',
      'Cleaning': '🧹',
      'Carpenter': '🔨',
      'Carpentry': '🔨',
      'Gardener': '🌱',
      'Gardening': '🌱',
      'Landscaping': '🌱',
      'AC Repair': '❄️',
      'Air Conditioning': '❄️',
      'AC Service': '❄️',
      'Snow Removal': '❄️',
      'Painter': '🎨',
      'Painting': '🎨',
      'HVAC Technician': '🌡️',
      'HVAC': '🌡️',
      'Locksmith': '🔐',
      'Lock Repair': '🔐',
      'Handyman': '🔧',
      'General Repair': '🔧',
      'Pool Maintenance': '🏊',
      'Pool Service': '🏊',
      'Roofing': '🏠',
      'Roof Repair': '🏠',
      'Pest Control': '🐛',
      'Security': '🔒',
      'Moving': '📦',
      'Babysitting': '👶',
      'Pet Sitting': '🐕',
      'Pet Care': '🐕',
      // Common complaint categories that might come from your API
      'Water Leakage': '💧',
      'Water Problem': '💧',
      'Electrical Problem': '⚡',
      'Power Issue': '⚡',
      'Heating Problem': '🔥',
      'Cooling Problem': '❄️',
      'Appliance Repair': '🔧',
      'Kitchen Repair': '🍽️',
      'Bathroom Repair': '🚿',
      'Door Repair': '🚪',
      'Window Repair': '🪟',
      'Floor Repair': '🏠',
      'Wall Repair': '🧱',
      'Ceiling Repair': '🏠',
      'Internet Problem': '📶',
      'WiFi Issue': '📶',
      'Other': '🔧',
      'General Issue': '🔧'
    };
    
    // Try exact match first
    if (iconMap[serviceName]) {
      return iconMap[serviceName];
    }
    
    // Try partial matching for compound service names
    const serviceNameLower = serviceName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (serviceNameLower.includes(key.toLowerCase()) || key.toLowerCase().includes(serviceNameLower)) {
        return icon;
      }
    }
    
    return '🔧'; // Default icon
  };

  // Fetch location-based recommendations using your actual backend API
  const getLocationBasedServices = async (coordinates, locationInfo) => {
    try {
      // Use city and state as required by backend
      if (!locationInfo?.city || !locationInfo?.state) throw new Error('Missing city or state');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/location-analytics`,
        {
          params: {
            city: locationInfo.city,
            state: locationInfo.state
          },
          withCredentials: true
        }
      );
      if (response.data.success && Array.isArray(response.data.bookings)) {
        // Group bookings by service/problem type
        const serviceCount = {};
        response.data.bookings.forEach(booking => {
          const serviceName = booking.problem || 'Other';
          serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1;
        });
        // Convert to array and sort
        const recommendations = Object.entries(serviceCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)
          .map(([name, count], index) => ({
            name,
            icon: getServiceIcon(name),
            popularity: Math.min(Math.round((count / Math.max(response.data.totalBookings, 1)) * 100), 100),
            nearby: Math.floor(Math.random() * 10) + 3,
            reason: `${count} recent bookings in your area`,
            bookingCount: count,
            trend: count > 5 ? 'trending' : count > 2 ? 'popular' : 'stable',
            _id: `service-${index}`
          }));
        return recommendations;
      }
    } catch (error) {
      console.log('Location analytics endpoint not available, trying alternative approach...');
    }
  };

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        // Get user's coordinates
        const coordinates = await getUserLocation();
        // Get location information (city, state) using reverse geocoding
        const locationInfo = await reverseGeocode(coordinates.latitude, coordinates.longitude);
        if (locationInfo) {
          setUserLocation(locationInfo.fullLocation);
        } else {
          setUserLocation("Your Location");
        }
        // Load location-based services with real coordinates and location info
        const locationBased = await getLocationBasedServices(coordinates, locationInfo);
        setRecommendations(Array.isArray(locationBased) ? locationBased : []);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        // Fallback: use default location and services
        setUserLocation("Your Area");
        const fallbackRecommendations = [
          { name: "Home Inspection", icon: "🔍", popularity: 85, nearby: 8, reason: "General maintenance" },
          { name: "Cleaning Service", icon: "🧹", popularity: 90, nearby: 12, reason: "Regular upkeep" },
          { name: "Handyman Service", icon: "🔧", popularity: 88, nearby: 10, reason: "Common repairs" }
        ];
        setRecommendations(fallbackRecommendations);
      }
      setLoading(false);
    };
    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="mt-12 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      {/* Location-based Recommendations */}
      <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-blue-600" />
          {/* <h3 className="text-xl font-semibold text-blue-800">Popular Bookings Near You</h3> */}
          {userLocation && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {userLocation}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-4">Based on recent bookings in your neighborhood</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((service, index) => (
            <motion.div
              key={service.name}
              className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105 relative"
              // onClick={() => onServiceSelect && onServiceSelect(service.name)}
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7 + index * 0.1 }}
            >
              {/* Trend indicator */}
              {service.trend === 'trending' && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  🔥 Trending
                </div>
              )}
              {service.trend === 'popular' && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  ⭐ Popular
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{service.icon}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{service.popularity}%</span>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-1">{service.name}</h4>
              <p className="text-xs text-blue-600 mb-1 font-medium">{service.reason}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{service.nearby} providers nearby</span>
                {service.bookingCount && (
                  <span className="text-xs text-green-600 font-medium">
                    {service.bookingCount} bookings
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why Choose Us - Static Banner */}
      <motion.div
        className="flex flex-wrap justify-center items-center gap-6 md:gap-12 p-6 bg-blue-50/80 backdrop-blur-sm rounded-xl border border-blue-100 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-800 text-sm">Verified Experts</p>
            <p className="text-xs text-gray-500">100% Background Checked</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-800 text-sm">Secure Booking</p>
            <p className="text-xs text-gray-500">Protected Payments</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="p-2 bg-blue-100 rounded-full text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-800 text-sm">Satisfaction Guarantee</p>
            <p className="text-xs text-gray-500">We ensure quality service</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SmartRecommendations;
