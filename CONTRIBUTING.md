# Contributing to MeliFlowExpressJS

Thank you for your interest in contributing to MeliFlowExpressJS! This guide will help you get started.

## Development Setup

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 15+ with PostGIS extension
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ntye/MeliFLowExpressJS.git
   cd MeliFLowExpressJS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start PostgreSQL with PostGIS**
   ```bash
   docker-compose up -d
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── config/          # Configuration (database, environment, CORS)
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Data access layer
├── models/          # Database models (Sequelize)
├── routes/          # Route definitions
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Architecture

The project follows a **layered architecture**:

```
Request → Routes → Controllers → Services → Repositories → Models → Database
                      ↓
                  Middleware
```

### Layers

1. **Routes** (`src/routes/`): Define API endpoints and validation
2. **Controllers** (`src/controllers/`): Handle HTTP requests/responses
3. **Services** (`src/services/`): Implement business logic
4. **Repositories** (`src/repositories/`): Data access and queries
5. **Models** (`src/models/`): Database schema definitions
6. **Middleware** (`src/middleware/`): Cross-cutting concerns

## Coding Standards

### TypeScript
- Use strict TypeScript settings
- Avoid `any` type unless dealing with dynamic data (like GeoJSON)
- Define interfaces for all data structures
- Use async/await for asynchronous operations

### Naming Conventions
- **Files**: camelCase (e.g., `ruchesController.ts`)
- **Classes**: PascalCase (e.g., `RuchesController`)
- **Functions/Variables**: camelCase (e.g., `getRucheById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RESULTS`)

### Code Style
- Use 2 spaces for indentation
- Use single quotes for strings
- Add JSDoc comments for public functions
- Keep functions small and focused
- Follow the Single Responsibility Principle

### Example Controller
```typescript
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/response';
import myService from '../services/myService';

export class MyController {
  /**
   * Get item by ID
   * GET /api/items/:id
   */
  getItemById = asyncHandler(async (req: Request, res: Response) => {
    const item = await myService.getById(req.params.id);
    return sendSuccess(res, item, 'Item retrieved successfully');
  });
}

export default new MyController();
```

## Adding New Features

### 1. Adding a New Endpoint

1. **Define validation schema** in `src/utils/validators.ts`
   ```typescript
   export const createItemSchema = Joi.object({
     name: Joi.string().required(),
     value: Joi.number().required(),
   });
   ```

2. **Create/update model** in `src/models/`
   ```typescript
   class Item extends Model<ItemAttributes, ItemCreationAttributes> {
     // Define model
   }
   ```

3. **Create repository methods** in `src/repositories/`
   ```typescript
   export class ItemRepository {
     async create(data: ItemCreationAttributes) {
       return await Item.create(data);
     }
   }
   ```

4. **Create service methods** in `src/services/`
   ```typescript
   export class ItemService {
     async createItem(data: ItemCreationAttributes) {
       return await itemRepository.create(data);
     }
   }
   ```

5. **Create controller** in `src/controllers/`
   ```typescript
   export class ItemsController {
     createItem = asyncHandler(async (req, res) => {
       const item = await itemService.createItem(req.body);
       return sendSuccess(res, item, 'Item created', 201);
     });
   }
   ```

6. **Define routes** in `src/routes/`
   ```typescript
   router.post('/', validate(createItemSchema), itemsController.createItem);
   ```

7. **Register routes** in `src/routes/index.ts`
   ```typescript
   router.use('/items', itemsRoutes);
   ```

### 2. Working with Spatial Data

For PostGIS operations:

```typescript
import { createPoint, createPolygon, toGeoJSON } from '../utils/spatial';

// Create a point
const point = createPoint(-122.4194, 37.7749);

// Create a polygon
const polygon = createPolygon([
  [-122.4194, 37.7749],
  [-122.4184, 37.7749],
  [-122.4184, 37.7739],
  [-122.4194, 37.7739],
]);

// Convert to GeoJSON
const geoJson = toGeoJSON(sequelizeGeometry);
```

### 3. Database Migrations

When changing the database schema:

1. Update the model in `src/models/`
2. Update `database_setup.sql`
3. Document the change in your PR

## Testing

### Running Checks

```bash
# Build the project
npm run build

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run typecheck
```

### Manual Testing

Use the provided Postman collection or cURL commands from `API_DOCUMENTATION.md`.

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards
   - Add comments where necessary
   - Keep commits atomic and meaningful

3. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit with descriptive messages**
   ```bash
   git commit -m "Add feature: description of what was added"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **PR Checklist**
   - [ ] Code builds successfully
   - [ ] Linter passes
   - [ ] No security vulnerabilities introduced
   - [ ] Documentation updated if needed
   - [ ] Meaningful commit messages
   - [ ] PR description explains changes

## Common Patterns

### Error Handling
Always use `asyncHandler` for async route handlers:

```typescript
import { asyncHandler } from '../middleware/errorHandler';

myMethod = asyncHandler(async (req, res) => {
  // Your code - errors are automatically caught
});
```

### Custom Errors
Throw `ApiError` for expected errors:

```typescript
import { ApiError } from '../middleware/errorHandler';

if (!item) {
  throw new ApiError('Item not found', 404);
}
```

### Response Format
Always use the response utilities:

```typescript
import { sendSuccess, sendError } from '../utils/response';

// Success
return sendSuccess(res, data, 'Success message', 200);

// Error (in middleware)
return sendError(res, 'Error message', 400);
```

### Validation
Always validate input with Joi:

```typescript
import { validate } from '../middleware/validation';
import { mySchema } from '../utils/validators';

router.post('/', validate(mySchema, 'body'), controller.method);
```

## Security Guidelines

1. **Never** use string interpolation in SQL queries
2. **Always** validate and sanitize user input
3. **Always** use parameterized queries
4. **Avoid** exposing sensitive data in error messages
5. **Use** environment variables for secrets
6. **Enable** CORS only for trusted origins in production

## Questions?

If you have questions or need help:
1. Check the existing documentation
2. Look at similar implementations in the codebase
3. Open an issue for discussion

Thank you for contributing! 🐝
