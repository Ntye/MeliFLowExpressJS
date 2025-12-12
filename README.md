"# MeliFLowExpressJS

Express.js REST API for beekeeping data management with PostGIS support.

## Features

- Complete CRUD operations for hives (ruches) and apiaries (ruchers)
- PostGIS spatial queries and GeoJSON responses
- Sensor measurement tracking
- Alert rule management and evaluation
- Weight gain analytics
- Comparison statistics
- Health check endpoints

## Tech Stack

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with PostGIS
- **ORM**: Sequelize
- **Validation**: Joi
- **Logging**: Winston

## Prerequisites

- Node.js 18+ 
- PostgreSQL 15+ with PostGIS extension
- npm or yarn

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Ntye/MeliFLowExpressJS.git
cd MeliFLowExpressJS
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your database credentials.

### 4. Start PostgreSQL with PostGIS (using Docker)

```bash
docker-compose up -d
```

The database will be automatically initialized with the schema from `database_setup.sql`.

### 5. Run the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/status` - Detailed status with database connectivity

### Ruches (Hives)
- `POST /api/ruches` - Create a new hive
- `GET /api/ruches` - List all hives (with filters)
- `GET /api/ruches/:id` - Get hive details
- `PUT /api/ruches/:id` - Update hive
- `DELETE /api/ruches/:id` - Delete hive
- `POST /api/ruches/:id/measurements` - Add measurement
- `GET /api/ruches/:id/measurements` - Get measurements
- `GET /api/ruches/:id/measurements/latest` - Get latest measurement
- `GET /api/ruches/:id/analytics/gain` - Get weight gain analytics
- `GET /api/ruches/:id/analytics/compare` - Get comparison statistics

### Ruchers (Apiaries)
- `POST /api/ruchers` - Create a new apiary
- `GET /api/ruchers` - List all apiaries (with filters)
- `GET /api/ruchers/:id` - Get apiary details
- `PUT /api/ruchers/:id` - Update apiary
- `DELETE /api/ruchers/:id` - Delete apiary
- `GET /api/ruchers/:id/ruches` - Get hives in apiary
- `PATCH /api/ruchers/:id/ruches/:ruche_id` - Add/remove hive from apiary
- `GET /api/ruchers/:id/stats` - Get aggregated statistics

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Data access layer
├── models/          # Database models
├── routes/          # Route definitions
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run typecheck` - Run TypeScript type checking

## Database Schema

The database includes the following tables:
- `users` - User accounts
- `ruchers` - Apiaries with polygon geometries
- `ruches` - Hives with point geometries
- `measurements` - Sensor data from hives
- `alert_rules` - Alert configuration
- `alerts` - Triggered alerts

See `database_setup.sql` for the complete schema.

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

### GeoJSON Response
```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  "properties": { ... }
}
```

## License

MIT
" 
