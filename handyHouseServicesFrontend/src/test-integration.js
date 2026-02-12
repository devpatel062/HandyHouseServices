// Test script for the SmartRecommendations API integration
// You can run this in the browser console to test the geolocation and API calls

const testGeolocationAndAPI = async () => {
  console.log('🧪 Testing Geolocation and API Integration...');
  
  try {
    // Test 1: Check if geolocation is available
    console.log('📍 Testing geolocation availability...');
    if (!navigator.geolocation) {
      console.error('❌ Geolocation is not supported');
      return;
    }
    console.log('✅ Geolocation is supported');

    // Test 2: Get current position
    console.log('📍 Getting current position...');
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      });
    });
    
    const { latitude, longitude } = position.coords;
    console.log(`✅ Got coordinates: ${latitude}, ${longitude}`);

    // Test 3: Test Mapbox reverse geocoding
    console.log('🗺️ Testing Mapbox reverse geocoding...');
    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!mapboxToken) {
      console.error('❌ Mapbox token not found in environment variables');
      return;
    }

    const geocodeResponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}&types=place,locality,neighborhood`
    );
    
    if (!geocodeResponse.ok) {
      console.error('❌ Mapbox geocoding failed');
      return;
    }
    
    const geocodeData = await geocodeResponse.json();
    const place = geocodeData.features?.[0];
    const city = place?.context?.find(c => c.id.includes('place'))?.text || place?.text;
    const state = place?.context?.find(c => c.id.includes('region'))?.text;
    
    console.log(`✅ Reverse geocoded to: ${city}, ${state}`);

    // Test 4: Test your existing services API
    console.log('🖥️ Testing your existing services API...');
    const servicesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/services`);

    if (servicesResponse.ok) {
      const services = await servicesResponse.json();
      console.log(`✅ Your services API working: Found ${services.length} services`);
      console.log('📋 Sample services:', services.slice(0, 3));
    } else {
      console.error('❌ Your services API failed');
      return;
    }

    // Test 5: Test booking-based recommendations endpoint
    console.log('📍 Testing booking-based recommendations endpoint...');
    try {
      const bookingRecsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations/nearby-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
          city,
          state,
          radius: 10
        })
      });

      if (bookingRecsResponse.ok) {
        const bookingData = await bookingRecsResponse.json();
        console.log('✅ Booking-based recommendations API working:', bookingData);
      } else {
        console.log('⚠️ Booking-based recommendations endpoint not implemented yet');
        
        // Test popular services by location
        console.log('� Testing popular services by location...');
        const popularResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/popular-services?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`);
        
        if (popularResponse.ok) {
          const popularData = await popularResponse.json();
          console.log('✅ Popular services API working:', popularData);
        } else {
          console.log('⚠️ Popular services endpoint not implemented - using booking analytics fallback');
        }
      }
    } catch (error) {
      console.log('⚠️ Booking-based recommendations not available - using analytics fallback');
    }

    // Test 6: Test booking analytics (used by SmartRecommendations)
    console.log('📈 Testing booking analytics...');
    try {
      const bookingsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, {
        credentials: 'include'
      });
      
      if (bookingsResponse.ok) {
        const bookings = await bookingsResponse.json();
        console.log(`✅ Bookings API working: Found ${bookings.length} bookings`);
        
        // Analyze booking data like the SmartRecommendations component does
        const serviceBookingCounts = {};
        bookings.forEach(booking => {
          const serviceName = booking.serviceName || booking.service;
          if (serviceName) {
            serviceBookingCounts[serviceName] = (serviceBookingCounts[serviceName] || 0) + 1;
          }
        });
        
        const topServices = Object.entries(serviceBookingCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5);
        
        console.log('📊 Top services by booking count:', topServices);
      } else {
        console.log('⚠️ Bookings API not accessible (might need authentication)');
      }
    } catch (error) {
      console.log('⚠️ Bookings analytics test failed:', error.message);
    }

    // Test 7: Test real-time stats endpoint
    console.log('📊 Testing real-time stats...');
    try {
      const statsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stats/real-time`);
      
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        console.log('✅ Real-time stats API working:', stats);
      } else {
        console.log('⚠️ Real-time stats endpoint not implemented yet');
      }
    } catch (error) {
      console.log('⚠️ Real-time stats test failed:', error.message);
    }

    // Test 8: Test user API (since your frontend uses it)
    console.log('👤 Testing user API...');
    try {
      const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
        credentials: 'include'
      });
      
      if (userResponse.ok) {
        console.log('✅ User API working (user is logged in)');
      } else {
        console.log('⚠️ User API returned non-OK status (user might not be logged in)');
      }
    } catch (error) {
      console.log('⚠️ User API test failed:', error.message);
    }

    console.log('🎉 All tests completed! SmartRecommendations should work with your backend.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Test specifically for your backend structure
const testYourBackendIntegration = async () => {
  console.log('🔧 Testing specific integration with your backend...');
  
  try {
    // Test your API base URL
    console.log(`🌐 Testing connection to: ${import.meta.env.VITE_API_BASE_URL}`);
    
    const healthCheck = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/services`);
    
    if (healthCheck.ok) {
      const data = await healthCheck.json();
      console.log('✅ Backend is responsive');
      console.log(`📊 Services available: ${data.length}`);
      
      // Show service types available
      const serviceTypes = [...new Set(data.map(service => service.service))];
      console.log('🛠️ Service types in your database:', serviceTypes);
      
      // Test data structure
      if (data.length > 0) {
        console.log('📝 Sample service structure:', {
          service: data[0].service,
          description: data[0].description,
          price: data[0].price,
          image: data[0].image ? 'Has image' : 'No image'
        });
      }
      
      return true;
    } else {
      console.error('❌ Backend not responding properly');
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
};

// Export for use in console
window.testGeolocationAndAPI = testGeolocationAndAPI;
window.testYourBackendIntegration = testYourBackendIntegration;

console.log('🧪 Enhanced test script loaded for your existing backend.');
console.log('Available test functions:');
console.log('  testGeolocationAndAPI() - Full integration test');
console.log('  testYourBackendIntegration() - Backend-only test');
