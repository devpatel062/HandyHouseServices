// Backend endpoint examples for booking-based recommendations
// Add these to your existing backend

// 1. Main endpoint for nearby booking recommendations
app.post('/api/recommendations/nearby-bookings', async (req, res) => {
  try {
    const { latitude, longitude, city, state, radius = 10 } = req.body;
    
    // Query bookings within the specified radius
    // Assuming you have a Booking model with location data
    const nearbyBookings = await Booking.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          distanceField: "distance",
          maxDistance: radius * 1000, // Convert km to meters
          spherical: true
        }
      },
      {
        $match: {
          status: 'completed', // Only completed bookings
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      },
      {
        $group: {
          _id: '$serviceName',
          bookingCount: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          totalRevenue: { $sum: '$amount' },
          uniqueProviders: { $addToSet: '$providerId' }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: 'service',
          as: 'serviceDetails'
        }
      },
      {
        $sort: { bookingCount: -1 }
      },
      {
        $limit: 6
      }
    ]);

    // Transform the data for frontend
    const recommendations = nearbyBookings.map(booking => ({
      name: booking._id,
      bookingCount: booking.bookingCount,
      popularity: Math.min(Math.round((booking.bookingCount / 10) * 100), 100),
      nearby: booking.uniqueProviders.length,
      reason: `${booking.bookingCount} recent bookings in your area`,
      averageRating: booking.averageRating,
      trend: booking.bookingCount > 5 ? 'trending' : 'popular',
      serviceDetails: booking.serviceDetails[0] || {}
    }));

    res.json({ 
      success: true,
      recommendations,
      location: { city, state, coordinates: { latitude, longitude } }
    });

  } catch (error) {
    console.error('Error fetching nearby bookings:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch nearby booking recommendations' 
    });
  }
});

// 2. Popular services by city endpoint
app.get('/api/bookings/popular-services', async (req, res) => {
  try {
    const { city, state } = req.query;
    
    const matchQuery = {};
    if (city) matchQuery['location.city'] = new RegExp(city, 'i');
    if (state) matchQuery['location.state'] = new RegExp(state, 'i');
    
    const popularServices = await Booking.aggregate([
      {
        $match: {
          ...matchQuery,
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) } // Last 60 days
        }
      },
      {
        $group: {
          _id: '$serviceName',
          bookingCount: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          averagePrice: { $avg: '$amount' },
          activeProviders: { $addToSet: '$providerId' },
          recentBookings: { $push: { date: '$createdAt', rating: '$rating' } }
        }
      },
      {
        $project: {
          serviceName: '$_id',
          bookingCount: 1,
          averageRating: 1,
          averagePrice: 1,
          activeProviders: { $size: '$activeProviders' },
          trend: {
            $cond: {
              if: { $gte: ['$bookingCount', 10] },
              then: 'trending',
              else: {
                $cond: {
                  if: { $gte: ['$bookingCount', 5] },
                  then: 'popular',
                  else: 'stable'
                }
              }
            }
          }
        }
      },
      {
        $sort: { bookingCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json(popularServices);

  } catch (error) {
    console.error('Error fetching popular services:', error);
    res.status(500).json({ error: 'Failed to fetch popular services' });
  }
});

// 3. Booking analytics endpoint
app.get('/api/analytics/booking-trends', async (req, res) => {
  try {
    const { timeframe = 30 } = req.query; // days
    
    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            service: '$serviceName',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          dailyBookings: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.service',
          totalBookings: { $sum: '$dailyBookings' },
          averageDailyBookings: { $avg: '$dailyBookings' },
          bookingDays: { $sum: 1 }
        }
      },
      {
        $sort: { totalBookings: -1 }
      }
    ]);

    res.json(bookingTrends);

  } catch (error) {
    console.error('Error fetching booking trends:', error);
    res.status(500).json({ error: 'Failed to fetch booking trends' });
  }
});

// 4. Real-time booking stats for the Quick Stats section
app.get('/api/stats/real-time', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [todayBookings, averageRating, activeProviders] = await Promise.all([
      Booking.countDocuments({ 
        createdAt: { $gte: today },
        status: { $in: ['confirmed', 'completed'] }
      }),
      
      Booking.aggregate([
        { 
          $match: { 
            rating: { $exists: true, $ne: null },
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        { 
          $group: { 
            _id: null, 
            avgRating: { $avg: '$rating' } 
          }
        }
      ]),
      
      Provider.countDocuments({ 
        isActive: true,
        lastSeen: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })
    ]);

    res.json({
      todayBookings,
      averageRating: averageRating[0]?.avgRating?.toFixed(1) || '4.8',
      activeProviders
    });

  } catch (error) {
    console.error('Error fetching real-time stats:', error);
    res.status(500).json({ error: 'Failed to fetch real-time stats' });
  }
});

// 5. Schema additions for your Booking model (if using Mongoose)
/*
const bookingSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  rating: { type: Number, min: 1, max: 5 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  scheduledDate: { type: Date },
  completedAt: { type: Date }
});

// Add geospatial index for location-based queries
bookingSchema.index({ location: '2dsphere' });
bookingSchema.index({ serviceName: 1, createdAt: -1 });
bookingSchema.index({ status: 1, createdAt: -1 });
*/
