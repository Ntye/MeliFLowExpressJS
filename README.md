"# MeliFlow Express.js API

A comprehensive Express.js backend API for MeliFlow, a beekeeping management application with real-time monitoring, analytics, and alert system.

## Features

### Ruches (Beehives) Management
- ✅ Create, read, update, and delete beehives
- ✅ Add measurements (weight, temperature, humidity, signal)
- ✅ Track measurements by date range
- ✅ Get latest measurement data
- ✅ Calculate gain analytics over time periods
- ✅ Compare beehive statistics with fleet averages

### Ruchers (Apiaries) Management
- ✅ Create, read, update, and delete apiaries
- ✅ Aggregate statistics across multiple beehives
- ✅ Manage beehive-apiary associations
- ✅ Track total weight, gain, and environmental conditions

### Alert System
- ✅ Create custom alert rules (weight, temperature, humidity thresholds)
- ✅ Automatic alert evaluation on new measurements
- ✅ Alert history and triggered alerts tracking
- ✅ Real-time WebSocket notifications
- ✅ Acknowledge and manage alerts

### Technical Stack
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Real-time**: WebSocket for live notifications
- **Logging**: Winston for structured logging
- **Validation**: Joi for request validation
- **Docker**: Full containerization support

## Installation

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/Ntye/MeliFLowExpressJS.git
cd MeliFLowExpressJS
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Set up the database**
```bash
# Create PostgreSQL database
createdb meliflow

# Sync database tables
npm run db:sync
```

5. **Start development server**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Docker Setup

```bash
# Start all services (PostgreSQL + API)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## API Endpoints

### Health & Status
- `GET /health` - Health check endpoint
- `GET /status` - API status and version info

### Ruches (Beehives) API

#### CRUD Operations
- `POST /api/v1/ruches` - Create a new beehive
- `GET /api/v1/ruches` - List all beehives (with filters)
- `GET /api/v1/ruches/:id` - Get beehive details
- `PUT /api/v1/ruches/:id` - Update beehive
- `DELETE /api/v1/ruches/:id` - Delete beehive

#### Measurements
- `POST /api/v1/ruches/:id/measurements` - Add measurement
- `GET /api/v1/ruches/:id/measurements` - Get measurements (with date filters)
- `GET /api/v1/ruches/:id/measurements/latest` - Get latest measurement

#### Analytics
- `GET /api/v1/ruches/:id/analytics/gain` - Get gain analytics
- `GET /api/v1/ruches/:id/compare` - Compare with other beehives

### Ruchers (Apiaries) API

#### CRUD Operations
- `POST /api/v1/ruchers` - Create a new apiary
- `GET /api/v1/ruchers` - List all apiaries
- `GET /api/v1/ruchers/:id` - Get apiary details
- `PUT /api/v1/ruchers/:id` - Update apiary
- `DELETE /api/v1/ruchers/:id` - Delete apiary

#### Statistics & Management
- `GET /api/v1/ruchers/:id/stats` - Get aggregated statistics
- `GET /api/v1/ruchers/:id/ruches` - List beehives in apiary
- `POST /api/v1/ruchers/:id/ruches/:rucheId` - Add beehive to apiary
- `DELETE /api/v1/ruchers/:id/ruches/:rucheId` - Remove beehive from apiary

### Alerts API

#### Alert Rules
- `POST /api/v1/alerts/rules` - Create alert rule
- `GET /api/v1/alerts/rules` - List alert rules (with filters)
- `GET /api/v1/alerts/rules/:id` - Get alert rule details
- `PUT /api/v1/alerts/rules/:id` - Update alert rule
- `DELETE /api/v1/alerts/rules/:id` - Delete alert rule
- `POST /api/v1/alerts/test/:id` - Test alert rule

#### Triggered Alerts
- `GET /api/v1/alerts/triggered` - List triggered alerts (with filters)
- `GET /api/v1/alerts/triggered/:id` - Get triggered alert details
- `PATCH /api/v1/alerts/triggered/:id/acknowledge` - Acknowledge alert

### WebSocket Connection
Connect to `ws://localhost:3000/ws/alerts` for real-time alert notifications.

## API Usage Examples

### Create a Beehive
```bash
curl -X POST http://localhost:3000/api/v1/ruches \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hive Alpha",
    "location": "North Garden",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "hiveType": "Langstroth",
    "status": "active"
  }'
```

### Add a Measurement
```bash
curl -X POST http://localhost:3000/api/v1/ruches/1/measurements \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 45.5,
    "temperature": 35.2,
    "humidity": 65.0,
    "signalStrength": -75,
    "batteryLevel": 87.5
  }'
```

### Create Alert Rule
```bash
curl -X POST http://localhost:3000/api/v1/alerts/rules \
  -H "Content-Type: application/json" \
  -d '{
    "name": "High Temperature Alert",
    "rucheId": 1,
    "alertType": "temperature",
    "condition": "greater_than",
    "threshold": 40,
    "enabled": true
  }'
```

### Get Gain Analytics
```bash
curl http://localhost:3000/api/v1/ruches/1/analytics/gain?days=30
```

## Database Schema

### Tables
- **users** - User accounts
- **ruchers** - Apiaries (collection of beehives)
- **ruches** - Individual beehives
- **measurements** - Time-series measurement data
- **alert_rules** - Alert configuration rules
- **triggered_alerts** - Alert history

### Relationships
- Users → Ruchers (one-to-many)
- Users → Ruches (one-to-many)
- Ruchers → Ruches (one-to-many)
- Ruches → Measurements (one-to-many)
- Ruches → AlertRules (one-to-many)
- AlertRules → TriggeredAlerts (one-to-many)

## Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=meliflow
DB_USER=postgres
DB_PASSWORD=postgres

# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:5173

# WebSocket
WS_PORT=3001

# Flask Microservice (optional)
FLASK_SERVICE_URL=http://localhost:5000
```

## Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
- `npm run lint` - Lint code with ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run db:sync` - Synchronize database schema

### Code Structure
```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Data access layer
├── models/          # Sequelize models
├── routes/          # API routes
├── middleware/      # Express middleware
├── utils/           # Utilities and validators
├── websocket/       # WebSocket handlers
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## Production Deployment

### Build the application
```bash
npm run build
```

### Run with Docker
```bash
docker-compose up -d
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database credentials
3. Set up proper CORS origins
4. Enable logging to files
5. Configure WebSocket port

## Monitoring & Logging

Logs are structured using Winston:
- Console output in development
- File logging in production (`logs/error.log`, `logs/combined.log`)
- Request/response logging
- Error tracking with stack traces

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ]
}
```

## WebSocket Events

### Connection
```json
{
  "type": "connected",
  "message": "Connected to MeliFlow alert notifications",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Alert Triggered
```json
{
  "type": "alert_triggered",
  "alert": { ... },
  "rule": { ... },
  "measurement": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository." 
