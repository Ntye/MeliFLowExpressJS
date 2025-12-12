import { Router } from 'express';
import { RucherController } from '../controllers/rucherController';
import { validate } from '../middleware/validation';
import { rucherValidation } from '../utils/validators';

const router = Router();
const controller = new RucherController();

// Rucher CRUD operations
router.post('/', validate(rucherValidation.create), (req, res) => controller.create(req, res));
router.get('/', (req, res) => controller.getAll(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.put('/:id', validate(rucherValidation.update), (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

// Statistics and ruches management
router.get('/:id/stats', (req, res) => controller.getStats(req, res));
router.get('/:id/ruches', (req, res) => controller.getRuches(req, res));
router.post('/:id/ruches/:rucheId', (req, res) => controller.addRuche(req, res));
router.delete('/:id/ruches/:rucheId', (req, res) => controller.removeRuche(req, res));

export default router;
