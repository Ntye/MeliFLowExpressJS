import { Router } from 'express';
import ruchesController from '../controllers/ruchesController';
import { validate } from '../middleware/validation';
import {
  createRucheSchema,
  updateRucheSchema,
  createMeasurementSchema,
  listRuchesQuerySchema,
  measurementsQuerySchema,
  analyticsQuerySchema,
  uuidSchema,
} from '../utils/validators';

const router = Router();

/**
 * Ruche (Hive) routes
 */

// Create a new ruche
router.post('/', validate(createRucheSchema, 'body'), ruchesController.createRuche);

// Get all ruches with filters
router.get('/', validate(listRuchesQuerySchema, 'query'), ruchesController.getAllRuches);

// Get ruche by ID
router.get('/:id', validate(uuidSchema, 'params'), ruchesController.getRucheById);

// Update ruche
router.put(
  '/:id',
  validate(uuidSchema, 'params'),
  validate(updateRucheSchema, 'body'),
  ruchesController.updateRuche
);

// Delete ruche
router.delete('/:id', validate(uuidSchema, 'params'), ruchesController.deleteRuche);

// Add measurement to ruche
router.post(
  '/:id/measurements',
  validate(uuidSchema, 'params'),
  validate(createMeasurementSchema, 'body'),
  ruchesController.addMeasurement
);

// Get measurements for ruche
router.get(
  '/:id/measurements',
  validate(uuidSchema, 'params'),
  validate(measurementsQuerySchema, 'query'),
  ruchesController.getMeasurements
);

// Get latest measurement for ruche
router.get(
  '/:id/measurements/latest',
  validate(uuidSchema, 'params'),
  ruchesController.getLatestMeasurement
);

// Get weight gain analytics
router.get(
  '/:id/analytics/gain',
  validate(uuidSchema, 'params'),
  validate(analyticsQuerySchema, 'query'),
  ruchesController.getWeightGainAnalytics
);

// Get comparison statistics
router.get(
  '/:id/analytics/compare',
  validate(uuidSchema, 'params'),
  ruchesController.getComparisonStats
);

export default router;
