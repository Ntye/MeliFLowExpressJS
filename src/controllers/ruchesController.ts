import { Request, Response } from 'express';
import rucheService from '../services/rucheService';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Controller for Ruches (Hives) endpoints
 */
export class RuchesController {
  /**
   * Create a new ruche
   * POST /api/ruches
   */
  createRuche = asyncHandler(async (req: Request, res: Response) => {
    const ruche = await rucheService.createRuche(req.body);
    return sendSuccess(res, ruche, 'Ruche created successfully', 201);
  });

  /**
   * Get all ruches with filters
   * GET /api/ruches
   */
  getAllRuches = asyncHandler(async (req: Request, res: Response) => {
    const ruches = await rucheService.getAllRuches(req.query);
    return sendSuccess(res, ruches, 'Ruches retrieved successfully');
  });

  /**
   * Get ruche by ID
   * GET /api/ruches/:id
   */
  getRucheById = asyncHandler(async (req: Request, res: Response) => {
    const ruche = await rucheService.getRucheById(req.params.id);
    return sendSuccess(res, ruche, 'Ruche retrieved successfully');
  });

  /**
   * Update ruche
   * PUT /api/ruches/:id
   */
  updateRuche = asyncHandler(async (req: Request, res: Response) => {
    const ruche = await rucheService.updateRuche(req.params.id, req.body);
    return sendSuccess(res, ruche, 'Ruche updated successfully');
  });

  /**
   * Delete ruche
   * DELETE /api/ruches/:id
   */
  deleteRuche = asyncHandler(async (req: Request, res: Response) => {
    await rucheService.deleteRuche(req.params.id);
    return sendSuccess(res, null, 'Ruche deleted successfully');
  });

  /**
   * Add measurement to ruche
   * POST /api/ruches/:id/measurements
   */
  addMeasurement = asyncHandler(async (req: Request, res: Response) => {
    const measurement = await rucheService.addMeasurement(req.params.id, req.body);
    return sendSuccess(res, measurement, 'Measurement added successfully', 201);
  });

  /**
   * Get measurements for ruche
   * GET /api/ruches/:id/measurements
   */
  getMeasurements = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      start_date: req.query.start_date ? new Date(req.query.start_date as string) : undefined,
      end_date: req.query.end_date ? new Date(req.query.end_date as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const measurements = await rucheService.getMeasurements(req.params.id, filters);
    return sendSuccess(res, measurements, 'Measurements retrieved successfully');
  });

  /**
   * Get latest measurement for ruche
   * GET /api/ruches/:id/measurements/latest
   */
  getLatestMeasurement = asyncHandler(async (req: Request, res: Response) => {
    const measurement = await rucheService.getLatestMeasurement(req.params.id);
    return sendSuccess(res, measurement, 'Latest measurement retrieved successfully');
  });

  /**
   * Get weight gain analytics
   * GET /api/ruches/:id/analytics/gain
   */
  getWeightGainAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const start_date = new Date(req.query.start_date as string);
    const end_date = new Date(req.query.end_date as string);

    const analytics = await rucheService.getWeightGainAnalytics(req.params.id, start_date, end_date);
    return sendSuccess(res, analytics, 'Weight gain analytics retrieved successfully');
  });

  /**
   * Get comparison statistics
   * GET /api/ruches/:id/analytics/compare
   */
  getComparisonStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await rucheService.getComparisonStats(req.params.id);
    return sendSuccess(res, stats, 'Comparison statistics retrieved successfully');
  });
}

export default new RuchesController();
