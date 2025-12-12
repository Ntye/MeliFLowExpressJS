import { Request, Response } from 'express';
import rucherService from '../services/rucherService';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Controller for Ruchers (Apiaries) endpoints
 */
export class RuchersController {
  /**
   * Create a new rucher
   * POST /api/ruchers
   */
  createRucher = asyncHandler(async (req: Request, res: Response) => {
    const rucher = await rucherService.createRucher(req.body);
    return sendSuccess(res, rucher, 'Rucher created successfully', 201);
  });

  /**
   * Get all ruchers with filters
   * GET /api/ruchers
   */
  getAllRuchers = asyncHandler(async (req: Request, res: Response) => {
    const ruchers = await rucherService.getAllRuchers(req.query);
    return sendSuccess(res, ruchers, 'Ruchers retrieved successfully');
  });

  /**
   * Get rucher by ID
   * GET /api/ruchers/:id
   */
  getRucherById = asyncHandler(async (req: Request, res: Response) => {
    const rucher = await rucherService.getRucherById(req.params.id);
    return sendSuccess(res, rucher, 'Rucher retrieved successfully');
  });

  /**
   * Update rucher
   * PUT /api/ruchers/:id
   */
  updateRucher = asyncHandler(async (req: Request, res: Response) => {
    const rucher = await rucherService.updateRucher(req.params.id, req.body);
    return sendSuccess(res, rucher, 'Rucher updated successfully');
  });

  /**
   * Delete rucher
   * DELETE /api/ruchers/:id
   */
  deleteRucher = asyncHandler(async (req: Request, res: Response) => {
    await rucherService.deleteRucher(req.params.id);
    return sendSuccess(res, null, 'Rucher deleted successfully');
  });

  /**
   * Get ruches belonging to rucher
   * GET /api/ruchers/:id/ruches
   */
  getRuches = asyncHandler(async (req: Request, res: Response) => {
    const ruches = await rucherService.getRuches(req.params.id);
    return sendSuccess(res, ruches, 'Ruches retrieved successfully');
  });

  /**
   * Add or remove ruche from rucher
   * PATCH /api/ruchers/:id/ruches/:ruche_id
   */
  manageRuche = asyncHandler(async (req: Request, res: Response) => {
    const { id, ruche_id } = req.params;
    const { action } = req.body; // 'add' or 'remove'

    let ruche;
    if (action === 'remove') {
      ruche = await rucherService.removeRuche(id, ruche_id);
    } else {
      // Default to 'add'
      ruche = await rucherService.addRuche(id, ruche_id);
    }

    return sendSuccess(res, ruche, `Ruche ${action === 'remove' ? 'removed from' : 'added to'} rucher successfully`);
  });

  /**
   * Get aggregated stats for rucher
   * GET /api/ruchers/:id/stats
   */
  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await rucherService.getStats(req.params.id);
    return sendSuccess(res, stats, 'Rucher stats retrieved successfully');
  });
}

export default new RuchersController();
