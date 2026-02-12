const express = require("express");
const router = express.Router();
const Booking = require("../models/complains");
const Provider = require("../models/provider");

// Simplified location analytics - filter bookings by city and state
router.get("/location-analytics", async (req, res) => {
  try {
    const { city, state } = req.query;
    // console.log("Location analytics request received:", { city, state });

    if (!city || !state) {
      return res.status(400).json({
        success: false,
        message: "Both city and state are required"
      });
    }

    // Fetch all bookings from database
    const allBookings = await Booking.find({});
    console.log("Fetched all bookings:", allBookings);

    // Filter bookings based on city and state
    const filteredBookings = allBookings.filter(booking => {
      if (!booking.address) return false;
      
      const { city: bookingCity, state: bookingState } = extractCityState(booking.address);
      console.log('Booking address:', booking.address, '| Extracted:', bookingCity, bookingState, '| Query:', city, state);
      return isLocationMatch(city, state, bookingCity, bookingState);
    });

    // Sort by date (newest first)
    filteredBookings.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log("Filtered bookings:", filteredBookings);
    res.status(200).json({
      success: true,
      filterCriteria: {
        city,
        state
      },
      totalBookings: filteredBookings.length,
      bookings: filteredBookings
    });

  } catch (error) {
    console.error("Error fetching location analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch location analytics",
      error: error.message
    });
  }
});

// Get available providers for a service in user's area based on address
router.get("/service-availability", async (req, res) => {
  try {
    const { address, serviceCategory } = req.query;

    if (!address || !serviceCategory) {
      return res.status(400).json({
        success: false,
        message: "Address and serviceCategory are required"
      });
    }

    // Create case-insensitive regex for address and service matching
    const addressRegex = new RegExp(address, 'i');
    const serviceRegex = new RegExp(serviceCategory, 'i');

    // Fetch providers from database based on location and service type
    const providers = await Provider.find({
      location: addressRegex,
      serviceType: serviceRegex
    });

    const availableCount = providers.filter(p => p.availability === 'Available').length;

    // Format providers data
    const formattedProviders = providers.map(provider => ({
      id: provider._id,
      name: provider.name,
      serviceType: provider.serviceType,
      rating: provider.rating,
      price: provider.price,
      phone: provider.phone,
      email: provider.email,
      isAvailable: provider.availability === 'Available',
      verified: provider.verified
    }));

    res.status(200).json({
      success: true,
      serviceCategory,
      address,
      availableProviders: availableCount,
      totalProviders: providers.length,
      providers: formattedProviders
    });

  } catch (error) {
    console.error("Error fetching service availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service availability",
      error: error.message
    });
  }
});

// Get booking history for a specific address
router.get("/booking-history", async (req, res) => {
  try {
    const { address, limit = 10 } = req.query;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required"
      });
    }

    // Create case-insensitive regex for address matching
    const addressRegex = new RegExp(address, 'i');

    // Fetch booking history from database
    const bookings = await Booking.find({ address: addressRegex })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    // Format booking data
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      fullname: booking.fullname,
      problem: booking.problem,
      date: booking.date,
      status: booking.status,
      price: booking.price,
      serviceProvider: {
        name: booking.serviceProvidername,
        email: booking.serviceProvideremail,
        phone: booking.serviceProvidernumber,
        rating: booking.serviceProviderrating
      }
    }));

    res.status(200).json({
      success: true,
      address,
      totalBookings: bookings.length,
      bookings: formattedBookings
    });

  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking history",
      error: error.message
    });
  }
});

// Helper function to extract city and state from complex address formats
function extractCityState(address) {
  if (!address) return { city: null, state: null };
  
  // Clean the address - remove extra spaces and normalize
  const cleanAddress = address.replace(/\s+/g, ' ').trim();
  
  // Split by comma and filter out empty parts
  const parts = cleanAddress.split(',').map(part => part.trim()).filter(part => part.length > 0);
  
  if (parts.length === 0) return { city: null, state: null };
  
  
  let city = null;
  let state = null;
  
  // Look for pincode (6 digits) to help identify state
  const pincodeIndex = parts.findIndex(part => /^\d{6}$/.test(part));
  
  if (pincodeIndex !== -1 && pincodeIndex > 0) {
    // If pincode found, state is usually before pincode
    state = parts[pincodeIndex - 1];
    // City is usually 2 positions before pincode
    if (pincodeIndex > 1) {
      city = parts[pincodeIndex - 2];
    }
  } else {
    // No pincode found, use last two parts
    if (parts.length >= 2) {
      state = parts[parts.length - 2];
      city = parts[parts.length - 3];
    }
  }
  
  // Clean city and state - remove numbers and special characters
  if (city) {
    city = city.replace(/[0-9\-]/g, '').trim();
  }
  if (state) {
    state = state.replace(/[0-9\-]/g, '').trim();
  }
  
  // Validate that city and state are not empty after cleaning
  if (!city || city.length === 0) city = null;
  if (!state || state.length === 0) state = null;
  
  return { city, state };
}

// Helper function for better city/state matching
function isLocationMatch(searchCity, searchState, addressCity, addressState) {
  if (!searchCity || !searchState || !addressCity || !addressState) {
    return false;
  }
  
  // Convert to lowercase for comparison
  const sCity = searchCity.toLowerCase();
  const sState = searchState.toLowerCase();
  const aCity = addressCity.toLowerCase();
  const aState = addressState.toLowerCase();
  
  // Exact match first
  if (sCity === aCity && sState === aState) {
    return true;
  }
  
  // Partial match - both city and state must have some match
  const cityMatch = aCity.includes(sCity) || sCity.includes(aCity) || 
                   aCity.split(' ').some(word => sCity.includes(word)) ||
                   sCity.split(' ').some(word => aCity.includes(word));
  
  const stateMatch = aState.includes(sState) || sState.includes(aState) ||
                    aState.split(' ').some(word => sState.includes(word)) ||
                    sState.split(' ').some(word => aState.includes(word));
  
  return cityMatch && stateMatch;
}

// Get filtered complaints based on city and state
router.get("/location-complaints", async (req, res) => {
  try {
    const { city, state } = req.query;

    if (!city || !state) {
      return res.status(400).json({
        success: false,
        message: "Both city and state are required"
      });
    }

    // Fetch all complaints from database
    const allComplaints = await Booking.find({});

    // Filter complaints based on city and state with improved matching
    const filteredComplaints = allComplaints.filter(complaint => {
      if (!complaint.address) return false;
      
      const { city: complaintCity, state: complaintState } = extractCityState(complaint.address);
      
      return isLocationMatch(city, state, complaintCity, complaintState);
    });

    // Format complaint data
    const formattedComplaints = filteredComplaints.map(complaint => {
      const { city: extractedCity, state: extractedState } = extractCityState(complaint.address);
      
      return {
        id: complaint._id,
        fullname: complaint.fullname,
        address: complaint.address,
        extractedLocation: {
          city: extractedCity,
          state: extractedState
        },
        contact: complaint.contact,
        email: complaint.email,
        problem: complaint.problem,
        date: complaint.date,
        status: complaint.status,
        price: complaint.price,
        serviceProvider: {
          name: complaint.serviceProvidername,
          email: complaint.serviceProvideremail,
          phone: complaint.serviceProvidernumber,
          rating: complaint.serviceProviderrating
        }
      };
    });

    // Sort by date (newest first)
    formattedComplaints.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      filterCriteria: {
        city,
        state
      },
      totalComplaints: allComplaints.length,
      filteredComplaints: formattedComplaints.length,
      complaints: formattedComplaints
    });

  } catch (error) {
    console.error("Error fetching location-based complaints:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch location-based complaints",
      error: error.message
    });
  }
});

// Get filtered complaints for logged-in user based on their city and state
router.get("/my-area-complaints", async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required"
      });
    }

    // Find user's address from their previous bookings
    const userBooking = await Booking.findOne({ email: userEmail });
    
    if (!userBooking) {
      return res.status(404).json({
        success: false,
        message: "User location not found. Please make a booking first to establish your location."
      });
    }

    const userAddress = userBooking.address;
    const { city: userCity, state: userState } = extractCityState(userAddress);

    if (!userCity || !userState) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract city and state from user address. Please ensure address format is: Street, City, State"
      });
    }

    // Fetch all complaints except user's own complaints
    const allComplaints = await Booking.find({
      email: { $ne: userEmail } // Exclude user's own complaints
    });

    // Filter complaints based on city and state matching with improved logic
    const filteredComplaints = allComplaints.filter(complaint => {
      if (!complaint.address) return false;
      
      const { city: complaintCity, state: complaintState } = extractCityState(complaint.address);
      
      return isLocationMatch(userCity, userState, complaintCity, complaintState);
    });

    // Format complaint data
    const formattedComplaints = filteredComplaints.map(complaint => {
      const { city: extractedCity, state: extractedState } = extractCityState(complaint.address);
      
      return {
        id: complaint._id,
        fullname: complaint.fullname,
        address: complaint.address,
        extractedLocation: {
          city: extractedCity,
          state: extractedState
        },
        contact: complaint.contact,
        problem: complaint.problem,
        date: complaint.date,
        status: complaint.status,
        price: complaint.price,
        serviceProvider: {
          name: complaint.serviceProvidername,
          email: complaint.serviceProvideremail,
          phone: complaint.serviceProvidernumber,
          rating: complaint.serviceProviderrating
        }
      };
    });

    // Sort by date (newest first)
    formattedComplaints.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      userEmail,
      userAddress,
      userLocation: {
        city: userCity,
        state: userState
      },
      totalComplaints: allComplaints.length,
      filteredComplaints: formattedComplaints.length,
      complaints: formattedComplaints
    });

  } catch (error) {
    console.error("Error fetching user area complaints:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user area complaints",
      error: error.message
    });
  }
});

module.exports = router;
