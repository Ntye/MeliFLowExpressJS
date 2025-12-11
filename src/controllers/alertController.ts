import { Request, Response } from 'express';
import { AlertService } from '../services/alertService';
import { logger } from '../utils/logger';

const alertService = new AlertService();

export class AlertController {
  async createRule(req: Request, res: Response) {
    try {
      const rule = await alertService.createAlertRule(req.body);
      logger.info(`Alert rule created: ${rule.id}`);
      res.status(201).json({
        success: true,
        data: rule,
      });
    } catch (error: any) {
      logger.error('Error creating alert rule:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create alert rule',
      });
    }
  }

  async getAllRules(req: Request, res: Response) {
    try {
      const filters = {
        rucheId: req.query.rucheId ? parseInt(req.query.rucheId as string) : undefined,
        rucherId: req.query.rucherId ? parseInt(req.query.rucherId as string) : undefined,
        enabled:
          req.query.enabled === 'true' ? true : req.query.enabled === 'false' ? false : undefined,
        userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
      };

      const rules = await alertService.getAllAlertRules(filters);
      res.status(200).json({
        success: true,
        data: rules,
        count: rules.length,
      });
    } catch (error: any) {
      logger.error('Error fetching alert rules:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch alert rules',
      });
    }
  }

  async getRuleById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const rule = await alertService.getAlertRuleById(id);
      res.status(200).json({
        success: true,
        data: rule,
      });
    } catch (error: any) {
      logger.error('Error fetching alert rule:', error);
      const statusCode = error.message === 'Alert rule not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to fetch alert rule',
      });
    }
  }

  async updateRule(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const rule = await alertService.updateAlertRule(id, req.body);
      logger.info(`Alert rule updated: ${id}`);
      res.status(200).json({
        success: true,
        data: rule,
      });
    } catch (error: any) {
      logger.error('Error updating alert rule:', error);
      const statusCode = error.message === 'Alert rule not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to update alert rule',
      });
    }
  }

  async deleteRule(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await alertService.deleteAlertRule(id);
      logger.info(`Alert rule deleted: ${id}`);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      logger.error('Error deleting alert rule:', error);
      const statusCode = error.message === 'Alert rule not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to delete alert rule',
      });
    }
  }

  async getTriggeredAlerts(req: Request, res: Response) {
    try {
      const filters = {
        rucheId: req.query.rucheId ? parseInt(req.query.rucheId as string) : undefined,
        acknowledged:
          req.query.acknowledged === 'true'
            ? true
            : req.query.acknowledged === 'false'
              ? false
              : undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      };

      const alerts = await alertService.getTriggeredAlerts(filters);
      res.status(200).json({
        success: true,
        data: alerts,
        count: alerts.length,
      });
    } catch (error: any) {
      logger.error('Error fetching triggered alerts:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch triggered alerts',
      });
    }
  }

  async getTriggeredAlertById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alert = await alertService.getTriggeredAlertById(id);
      res.status(200).json({
        success: true,
        data: alert,
      });
    } catch (error: any) {
      logger.error('Error fetching triggered alert:', error);
      const statusCode = error.message === 'Triggered alert not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to fetch triggered alert',
      });
    }
  }

  async acknowledgeAlert(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alert = await alertService.acknowledgeAlert(id);
      logger.info(`Alert acknowledged: ${id}`);
      res.status(200).json({
        success: true,
        data: alert,
      });
    } catch (error: any) {
      logger.error('Error acknowledging alert:', error);
      const statusCode = error.message === 'Triggered alert not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to acknowledge alert',
      });
    }
  }

  async testRule(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await alertService.testAlertRule(id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Error testing alert rule:', error);
      const statusCode = error.message === 'Alert rule not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to test alert rule',
      });
    }
  }
}
