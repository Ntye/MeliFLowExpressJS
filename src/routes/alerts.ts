import { Router } from 'express';
import { AlertController } from '../controllers/alertController';
import { validate } from '../middleware/validation';
import { alertRuleValidation } from '../utils/validators';

const router = Router();
const controller = new AlertController();

// Alert rules CRUD operations
router.post('/rules', validate(alertRuleValidation.create), (req, res) =>
  controller.createRule(req, res)
);
router.get('/rules', (req, res) => controller.getAllRules(req, res));
router.get('/rules/:id', (req, res) => controller.getRuleById(req, res));
router.put('/rules/:id', validate(alertRuleValidation.update), (req, res) =>
  controller.updateRule(req, res)
);
router.delete('/rules/:id', (req, res) => controller.deleteRule(req, res));

// Triggered alerts operations
router.get('/triggered', (req, res) => controller.getTriggeredAlerts(req, res));
router.get('/triggered/:id', (req, res) => controller.getTriggeredAlertById(req, res));
router.patch('/triggered/:id/acknowledge', (req, res) => controller.acknowledgeAlert(req, res));

// Test alert rule
router.post('/test/:id', (req, res) => controller.testRule(req, res));

export default router;
