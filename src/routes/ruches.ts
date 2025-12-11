import { Router } from 'express';
import { RucheController } from '../controllers/rucheController';
import { validate } from '../middleware/validation';
import { rucheValidation, measurementValidation } from '../utils/validators';

const router = Router();
const controller = new RucheController();

// Ruche CRUD operations
router.post('/', validate(rucheValidation.create), (req, res) => controller.create(req, res));
router.get('/', (req, res) => controller.getAll(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.put('/:id', validate(rucheValidation.update), (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

// Measurement operations
router.post('/:id/measurements', validate(measurementValidation.create), (req, res) =>
  controller.addMeasurement(req, res)
);
router.get('/:id/measurements', (req, res) => controller.getMeasurements(req, res));
router.get('/:id/measurements/latest', (req, res) => controller.getLatestMeasurement(req, res));

// Analytics operations
router.get('/:id/analytics/gain', (req, res) => controller.getGainAnalytics(req, res));
router.get('/:id/compare', (req, res) => controller.getComparisonStats(req, res));

export default router;
