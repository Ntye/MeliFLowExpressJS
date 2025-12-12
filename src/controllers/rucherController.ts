import { Request, Response } from 'express';
import { RucherService } from '../services/rucherService';
import { logger } from '../utils/logger';

const rucherService = new RucherService();

export class RucherController {
  async create(req: Request, res: Response) {
    try {
      const rucher = await rucherService.createRucher(req.body);
      logger.info(`Rucher created: ${rucher.id}`);
      res.status(201).json({
        success: true,
        data: rucher,
      });
    } catch (error: any) {
      logger.error('Error creating rucher:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create rucher',
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const ruchers = await rucherService.getAllRuchers(userId);
      res.status(200).json({
        success: true,
        data: ruchers,
        count: ruchers.length,
      });
    } catch (error: any) {
      logger.error('Error fetching ruchers:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch ruchers',
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const rucher = await rucherService.getRucherById(id);
      res.status(200).json({
        success: true,
        data: rucher,
      });
    } catch (error: any) {
      logger.error('Error fetching rucher:', error);
      const statusCode = error.message === 'Rucher not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to fetch rucher',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const rucher = await rucherService.updateRucher(id, req.body);
      logger.info(`Rucher updated: ${id}`);
      res.status(200).json({
        success: true,
        data: rucher,
      });
    } catch (error: any) {
      logger.error('Error updating rucher:', error);
      const statusCode = error.message === 'Rucher not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to update rucher',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await rucherService.deleteRucher(id);
      logger.info(`Rucher deleted: ${id}`);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      logger.error('Error deleting rucher:', error);
      const statusCode = error.message === 'Rucher not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to delete rucher',
      });
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const stats = await rucherService.getAggregatedStats(id);
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      logger.error('Error fetching rucher stats:', error);
      const statusCode = error.message === 'Rucher not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to fetch rucher stats',
      });
    }
  }

  async getRuches(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const ruches = await rucherService.getRuches(id);
      res.status(200).json({
        success: true,
        data: ruches,
        count: ruches.length,
      });
    } catch (error: any) {
      logger.error('Error fetching rucher ruches:', error);
      const statusCode = error.message === 'Rucher not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to fetch rucher ruches',
      });
    }
  }

  async addRuche(req: Request, res: Response) {
    try {
      const rucherId = parseInt(req.params.id);
      const rucheId = parseInt(req.params.rucheId);
      const ruche = await rucherService.addRucheToRucher(rucherId, rucheId);
      logger.info(`Ruche ${rucheId} added to rucher ${rucherId}`);
      res.status(200).json({
        success: true,
        data: ruche,
      });
    } catch (error: any) {
      logger.error('Error adding ruche to rucher:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to add ruche to rucher',
      });
    }
  }

  async removeRuche(req: Request, res: Response) {
    try {
      const rucherId = parseInt(req.params.id);
      const rucheId = parseInt(req.params.rucheId);
      const result = await rucherService.removeRucheFromRucher(rucherId, rucheId);
      logger.info(`Ruche ${rucheId} removed from rucher ${rucherId}`);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      logger.error('Error removing ruche from rucher:', error);
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to remove ruche from rucher',
      });
    }
  }
}
