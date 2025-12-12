import { Router } from 'express';
import healthController from '../controllers/healthController';

const router = Router();

/**
 * Health check routes
 */

// Basic health check
router.get('/health', healthController.health);

// Detailed status check
router.get('/status', healthController.status);

export default router;
