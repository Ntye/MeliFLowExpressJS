import { Router } from 'express';
import rucheRoutes from './ruches';
import rucherRoutes from './ruchers';
import alertRoutes from './alerts';

const router = Router();

router.use('/ruches', rucheRoutes);
router.use('/ruchers', rucherRoutes);
router.use('/alerts', alertRoutes);

export default router;
