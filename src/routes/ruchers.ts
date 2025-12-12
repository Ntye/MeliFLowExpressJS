import { Router } from 'express';
import ruchersController from '../controllers/ruchersController';
import { validate } from '../middleware/validation';
import {
  createRucherSchema,
  updateRucherSchema,
  listRuchersQuerySchema,
  uuidSchema,
  uuidWithRucheSchema,
  manageRucheSchema,
} from '../utils/validators';

const router = Router();

/**
 * Rucher (Apiary) routes
 */

// Create a new rucher
router.post('/', validate(createRucherSchema, 'body'), ruchersController.createRucher);

// Get all ruchers with filters
router.get('/', validate(listRuchersQuerySchema, 'query'), ruchersController.getAllRuchers);

// Get rucher by ID
router.get('/:id', validate(uuidSchema, 'params'), ruchersController.getRucherById);

// Update rucher
router.put(
  '/:id',
  validate(uuidSchema, 'params'),
  validate(updateRucherSchema, 'body'),
  ruchersController.updateRucher
);

// Delete rucher
router.delete('/:id', validate(uuidSchema, 'params'), ruchersController.deleteRucher);

// Get ruches belonging to rucher
router.get('/:id/ruches', validate(uuidSchema, 'params'), ruchersController.getRuches);

// Add or remove ruche from rucher
router.patch(
  '/:id/ruches/:ruche_id',
  validate(uuidWithRucheSchema, 'params'),
  validate(manageRucheSchema, 'body'),
  ruchersController.manageRuche
);

// Get aggregated stats for rucher
router.get('/:id/stats', validate(uuidSchema, 'params'), ruchersController.getStats);

export default router;
