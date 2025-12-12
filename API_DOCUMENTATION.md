# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## Health Check Endpoints

### GET /api/health
Basic health check to verify the service is running.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2023-12-12T05:30:00.000Z"
  }
}
```

### GET /api/status
Detailed status including database connectivity.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2023-12-12T05:30:00.000Z",
    "uptime": 123.45,
    "environment": "development",
    "database": {
      "status": "connected",
      "error": null
    },
    "memory": { ... }
  }
}
```

## Ruches (Hives) Endpoints

### POST /api/ruches
Create a new hive.

**Request Body:**
```json
{
  "name": "Hive 1",
  "description": "Main production hive",
  "location": {
    "type": "Point",
    "coordinates": [-122.4194, 37.7749]
  },
  "rucher_id": "uuid-of-apiary",
  "hive_type": "Langstroth",
  "installation_date": "2023-01-15",
  "active": true
}
```

**Response:** GeoJSON Feature with hive data

### GET /api/ruches
List all hives with optional filters.

**Query Parameters:**
- `active` (boolean): Filter by active status
- `rucher_id` (uuid): Filter by apiary ID
- `latitude` (number): Center point latitude for radius search
- `longitude` (number): Center point longitude for radius search
- `radius` (number): Search radius in meters
- `limit` (number, default: 50): Maximum results
- `offset` (number, default: 0): Pagination offset

**Example:**
```
GET /api/ruches?active=true&latitude=37.7749&longitude=-122.4194&radius=5000&limit=20
```

**Response:** GeoJSON FeatureCollection

### GET /api/ruches/:id
Get details of a specific hive.

**Response:** GeoJSON Feature

### PUT /api/ruches/:id
Update a hive.

**Request Body:** (any combination of fields)
```json
{
  "name": "Updated Hive Name",
  "active": false
}
```

**Response:** GeoJSON Feature

### DELETE /api/ruches/:id
Delete a hive.

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Ruche deleted successfully"
}
```

### POST /api/ruches/:id/measurements
Add a measurement to a hive.

**Request Body:**
```json
{
  "weight": 45.5,
  "temperature": 35.2,
  "humidity": 65.0,
  "battery_level": 85.0,
  "timestamp": "2023-12-12T10:30:00Z"
}
```

**Response:** Measurement object

**Note:** This endpoint automatically evaluates alert rules for the hive.

### GET /api/ruches/:id/measurements
Get measurements for a hive.

**Query Parameters:**
- `start_date` (ISO date): Start of date range
- `end_date` (ISO date): End of date range
- `limit` (number, default: 100): Maximum results
- `offset` (number, default: 0): Pagination offset

**Example:**
```
GET /api/ruches/:id/measurements?start_date=2023-12-01&end_date=2023-12-12&limit=50
```

**Response:** Array of measurements

### GET /api/ruches/:id/measurements/latest
Get the most recent measurement for a hive.

**Response:** Single measurement object

### GET /api/ruches/:id/analytics/gain
Get weight gain analytics for a hive.

**Query Parameters:**
- `start_date` (ISO date, required): Start date
- `end_date` (ISO date, required): End date

**Example:**
```
GET /api/ruches/:id/analytics/gain?start_date=2023-12-01&end_date=2023-12-12
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_gain": 5.5,
    "average_daily_gain": 0.5,
    "measurements_count": 20,
    "start_weight": 40.0,
    "end_weight": 45.5,
    "start_date": "2023-12-01",
    "end_date": "2023-12-12"
  }
}
```

### GET /api/ruches/:id/analytics/compare
Get comparison statistics with other hives.

**Response:**
```json
{
  "success": true,
  "data": {
    "ruche_id": "uuid",
    "latest_measurement": { ... },
    "comparison_with_average": {
      "avg_weight": 42.5,
      "avg_temperature": 34.8,
      "avg_humidity": 63.2
    }
  }
}
```

## Ruchers (Apiaries) Endpoints

### POST /api/ruchers
Create a new apiary.

**Request Body:**
```json
{
  "name": "North Apiary",
  "description": "Main production apiary",
  "location": {
    "type": "Polygon",
    "coordinates": [[
      [-122.4194, 37.7749],
      [-122.4184, 37.7749],
      [-122.4184, 37.7739],
      [-122.4194, 37.7739],
      [-122.4194, 37.7749]
    ]]
  },
  "user_id": "uuid-of-user",
  "active": true
}
```

**Response:** GeoJSON Feature

### GET /api/ruchers
List all apiaries with optional filters.

**Query Parameters:**
- `active` (boolean): Filter by active status
- `user_id` (uuid): Filter by user ID
- `limit` (number, default: 50): Maximum results
- `offset` (number, default: 0): Pagination offset

**Response:** GeoJSON FeatureCollection

### GET /api/ruchers/:id
Get details of a specific apiary.

**Response:** GeoJSON Feature

### PUT /api/ruchers/:id
Update an apiary.

**Request Body:** (any combination of fields)
```json
{
  "name": "Updated Apiary Name",
  "active": true
}
```

**Response:** GeoJSON Feature

### DELETE /api/ruchers/:id
Delete an apiary.

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Rucher deleted successfully"
}
```

### GET /api/ruchers/:id/ruches
Get all hives in an apiary.

**Response:** GeoJSON FeatureCollection

### PATCH /api/ruchers/:id/ruches/:ruche_id
Add or remove a hive from an apiary.

**Request Body:**
```json
{
  "action": "add"
}
```
or
```json
{
  "action": "remove"
}
```

**Response:** GeoJSON Feature of the modified hive

### GET /api/ruchers/:id/stats
Get aggregated statistics for an apiary.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_ruches": 10,
    "active_ruches": 8,
    "aggregate_stats": {
      "avg_weight": 42.5,
      "avg_temperature": 34.8,
      "avg_humidity": 63.2,
      "min_battery": 75.0,
      "latest_timestamp": "2023-12-12T10:30:00Z"
    }
  }
}
```

## GeoJSON Format

All spatial data is returned in GeoJSON format:

### Point (Hive)
```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-122.4194, 37.7749]
  },
  "properties": {
    "id": "uuid",
    "name": "Hive 1",
    "description": "...",
    "rucher_id": "uuid",
    "hive_type": "Langstroth",
    "installation_date": "2023-01-15",
    "active": true,
    "createdAt": "2023-01-15T10:00:00Z",
    "updatedAt": "2023-01-15T10:00:00Z"
  }
}
```

### Polygon (Apiary)
```json
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-122.4194, 37.7749],
      [-122.4184, 37.7749],
      [-122.4184, 37.7739],
      [-122.4194, 37.7739],
      [-122.4194, 37.7749]
    ]]
  },
  "properties": {
    "id": "uuid",
    "name": "North Apiary",
    "description": "...",
    "user_id": "uuid",
    "active": true,
    "createdAt": "2023-01-15T10:00:00Z",
    "updatedAt": "2023-01-15T10:00:00Z"
  }
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Example Usage with cURL

### Create a hive
```bash
curl -X POST http://localhost:3000/api/ruches \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hive",
    "location": {
      "type": "Point",
      "coordinates": [-122.4194, 37.7749]
    }
  }'
```

### Get hives within radius
```bash
curl "http://localhost:3000/api/ruches?latitude=37.7749&longitude=-122.4194&radius=5000"
```

### Add measurement
```bash
curl -X POST http://localhost:3000/api/ruches/{hive-id}/measurements \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 45.5,
    "temperature": 35.2,
    "humidity": 65.0
  }'
```

## Notes

- All coordinates use WGS84 (EPSG:4326) coordinate system
- Coordinates are in [longitude, latitude] order (GeoJSON standard)
- Timestamps are in ISO 8601 format
- UUIDs are version 4
- All endpoints support CORS
- Request and response logging is enabled
