# Setup Instructions for MeliFlow Express.js API

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 15 with PostGIS extension
- Git

## Installation Steps

### 1. Pull the Latest Changes

```bash
git pull origin copilot/implement-beehives-management-api
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js, Sequelize, PostgreSQL drivers
- TypeScript and development dependencies
- WebSocket support (ws)
- Logging (Winston), Validation (Joi), etc.

### 3. Configure Environment

Copy the example environment file and configure your database:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=meliflow
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development

# WebSocket Configuration
WS_PORT=3001
```

### 4. Setup PostgreSQL Database

Create the database and enable PostGIS:

```sql
CREATE DATABASE meliflow;
\c meliflow
CREATE EXTENSION IF NOT EXISTS postgis;
```

Run the schema from the SQL file provided (see main README for the complete schema).

### 5. Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 6. Run the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## Troubleshooting

### Error: "Cannot find module" or "Module not found"

**Solution:** Run `npm install` to install all dependencies.

### Error: "Unable to compile TypeScript"

**Solution:** 
1. Pull latest changes: `git pull`
2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Error: "dist/server.js not found"

**Solution:** Build the project first with `npm run build` before running `npm start`.

### Database Connection Errors

**Solution:** 
1. Ensure PostgreSQL is running
2. Verify your `.env` database credentials
3. Confirm PostGIS extension is installed: `CREATE EXTENSION IF NOT EXISTS postgis;`

## API Endpoints

Once running, the API will be available at:
- REST API: `http://localhost:3000/api/v1/`
- WebSocket: `ws://localhost:3001/ws/alerts`
- Health check: `http://localhost:3000/health`

See the main README.md for complete API documentation.

## Docker Setup (Alternative)

If you prefer Docker:

```bash
docker-compose up -d
```

This will start both PostgreSQL with PostGIS and the Node.js API.
