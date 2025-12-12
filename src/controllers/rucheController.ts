import { Request, Response } from 'express';
import { RucheService } from '../services/rucheService';
import { logger } from '../utils/logger';

const rucheService = new RucheService();

export class RucheController {
  async create(req: Request, res: Response) {
    try {
      const ruche = await rucheService.createRuche(req.body);
      logger.info(`Ruche created: ${ruche.id}`);
      res.status(201).json({
        success: true,
        data: ruche,
      });
    } catch (error: any) {
      logger.error('Error creating ruche:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create ruche',
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const filters = {
        status: req.query.status as string,
        rucherId: req.query.rucherId ? parseInt(req.query.rucherId as string) : undefined,
        userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
      };

      const ruches = await rucheService.getAllRuches(filters);
      res.status(200).json({
        success: true,
        data: ruches,
        count: ruches.length,
      });
    } catch (error: any) {
      logger.error('Error fetching ruches:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch ruches',
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const ruche = await rucheService.getRucheById(id);
      res.status(200).json({
        success: true,
        data: ruche,
      });
    } catch (error: any) {
      logger.error('Error fetching ruche:', error);
      const statusCode = error.message === 'Ruche not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to fetch ruche',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const ruche = await rucheService.updateRuche(id, req.body);
      logger.info(`Ruche updated: ${id}`);
      res.status(200).json({
        success: true,
        data: ruche,
      });
    } catch (error: any) {
      logger.error('Error updating ruche:', error);
      const statusCode = error.message === 'Ruche not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to update ruche',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await rucheService.deleteRuche(id);
      logger.info(`Ruche deleted: ${id}`);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      logger.error('Error deleting ruche:', error);
      const statusCode = error.message === 'Ruche not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to delete ruche',
      });
    }
  }

  async addMeasurement(req: Request, res: Response) {
    try {
      const rucheId = parseInt(req.params.id);
      const measurement = await rucheService.addMeasurement(rucheId, req.body);
      logger.info(`Measurement added to ruche ${rucheId}`);
      res.status(201).json({
        success: true,
        data: measurement,
      });
    } catch (error: any) {
      logger.error('Error adding measurement:', error);
      const statusCode = error.message === 'Ruche not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to add measurement',
      });
    }
  }

  async getMeasurements(req: Request, res: Response) {
    try {
      const rucheId = parseInt(req.params.id);
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const measurements = await rucheService.getMeasurements(rucheId, startDate, endDate);
      res.status(200).json({
        success: true,
        data: measurements,
        count: measurements.length,
      });
    } catch (error: any) {
      logger.error('Error fetching measurements:', error);
      const statusCode = error.message === 'Ruche not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to fetch measurements',
      });
    }
  }

  async getLatestMeasurement(req: Request, res: Response) {
    try {
      const rucheId = parseInt(req.params.id);
      const measurement = await rucheService.getLatestMeasurement(rucheId);
      res.status(200).json({
        success: true,
        data: measurement,
      });
    } catch (error: any) {
      logger.error('Error fetching latest measurement:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to fetch latest measurement',
      });
    }
  }

  async getGainAnalytics(req: Request, res: Response) {
    try {
      const rucheId = parseInt(req.params.id);
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const analytics = await rucheService.getGainAnalytics(rucheId, days);
      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      logger.error('Error fetching gain analytics:', error);
      const statusCode = error.message === 'Ruche not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to fetch gain analytics',
      });
    }
  }

  async getComparisonStats(req: Request, res: Response) {
    try {
      const rucheId = parseInt(req.params.id);
      const stats = await rucheService.getComparisonStats(rucheId);
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      logger.error('Error fetching comparison stats:', error);
      const statusCode = error.message === 'Ruche not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to fetch comparison stats',
      });
    }
  }
}
