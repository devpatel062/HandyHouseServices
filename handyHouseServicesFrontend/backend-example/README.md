# HandyHouse Backend Example

This is a simple Express.js backend that provides location-based service recommendations for the HandyHouse Services frontend.

## Features

- Real location-based service recommendations
- City-specific service suggestions
- Fallback recommendations for unknown locations
- CORS enabled for frontend integration

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend-example
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5001` (matching your frontend's `VITE_API_BASE_URL`).

## API Endpoints

### POST /api/recommendations/location

Request body:
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "city": "San Francisco",
  "state": "CA"
}
```

Response:
```json
{
  "success": true,
  "location": {
    "city": "San Francisco",
    "state": "CA",
    "coordinates": {
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  },
  "recommendations": [
    {
      "name": "Earthquake Retrofitting",
      "icon": "🏠",
      "popularity": 95,
      "nearby": 8,
      "reason": "High seismic activity in Bay Area",
      "price": "$2,500 - $8,000"
    }
  ]
}
```

### GET /api/health

Health check endpoint that returns server status.

## Supported Cities

The backend has specific recommendations for:
- San Francisco
- Phoenix
- Boston
- New York
- Miami
- Seattle
- Chicago
- Los Angeles
- Denver

For other cities, it returns default recommendations.

## Integration with Frontend

Your React frontend is already configured to use this backend. The SmartRecommendations component will:

1. Get user's geolocation
2. Use Mapbox to reverse geocode coordinates to city/state
3. Send a POST request to `/api/recommendations/location`
4. Display the returned recommendations

If the backend is not available, the frontend will fall back to local recommendations.
