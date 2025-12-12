import { Router } from 'express';
import ruchesRoutes from './ruches';
import ruchersRoutes from './ruchers';
import healthRoutes from './health';

const router = Router();

/**
 * Mount all API routes
 */
router.use('/ruches', ruchesRoutes);
router.use('/ruchers', ruchersRoutes);
router.use('/', healthRoutes);

export default router;
