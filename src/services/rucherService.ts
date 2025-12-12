import rucherRepository from '../repositories/rucherRepository';
import { Rucher, Ruche } from '../models';
import { RucherCreationAttributes } from '../models/Rucher';
import { createFeature, createFeatureCollection, toGeoJSON } from '../utils/spatial';
import { ApiError } from '../middleware/errorHandler';

/**
 * Service for Rucher (Apiary) business logic
 */
export class RucherService {
  /**
   * Create a new rucher
   */
  async createRucher(data: RucherCreationAttributes): Promise<any> {
    const rucher = await rucherRepository.create(data);
    return this.formatRucherAsFeature(rucher);
  }

  /**
   * Get rucher by ID
   */
  async getRucherById(id: string): Promise<any> {
    const rucher = await rucherRepository.findById(id);
    if (!rucher) {
      throw new ApiError('Rucher not found', 404);
    }
    return this.formatRucherAsFeature(rucher);
  }

  /**
   * Get all ruchers with filters
   */
  async getAllRuchers(filters: {
    active?: boolean;
    user_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<any> {
    const ruchers = await rucherRepository.findAll(filters);
    const features = ruchers.map((rucher) => this.formatRucherAsFeature(rucher));
    return createFeatureCollection(features);
  }

  /**
   * Update rucher
   */
  async updateRucher(id: string, data: Partial<RucherCreationAttributes>): Promise<any> {
    const rucher = await rucherRepository.update(id, data);
    if (!rucher) {
      throw new ApiError('Rucher not found', 404);
    }
    return this.formatRucherAsFeature(rucher);
  }

  /**
   * Delete rucher
   */
  async deleteRucher(id: string): Promise<void> {
    const deleted = await rucherRepository.delete(id);
    if (!deleted) {
      throw new ApiError('Rucher not found', 404);
    }
  }

  /**
   * Get ruches belonging to rucher
   */
  async getRuches(rucher_id: string): Promise<any> {
    // Verify rucher exists
    const rucher = await rucherRepository.findById(rucher_id);
    if (!rucher) {
      throw new ApiError('Rucher not found', 404);
    }

    const ruches = await rucherRepository.getRuches(rucher_id);
    const features = ruches.map((ruche) => this.formatRucheAsFeature(ruche));
    return createFeatureCollection(features);
  }

  /**
   * Add ruche to rucher
   */
  async addRuche(rucher_id: string, ruche_id: string): Promise<any> {
    // Verify rucher exists
    const rucher = await rucherRepository.findById(rucher_id);
    if (!rucher) {
      throw new ApiError('Rucher not found', 404);
    }

    const ruche = await rucherRepository.addRuche(rucher_id, ruche_id);
    if (!ruche) {
      throw new ApiError('Ruche not found', 404);
    }

    return this.formatRucheAsFeature(ruche);
  }

  /**
   * Remove ruche from rucher
   */
  async removeRuche(rucher_id: string, ruche_id: string): Promise<any> {
    const ruche = await rucherRepository.removeRuche(rucher_id, ruche_id);
    if (!ruche) {
      throw new ApiError('Ruche not found or does not belong to this rucher', 404);
    }

    return this.formatRucheAsFeature(ruche);
  }

  /**
   * Get aggregated stats for rucher
   */
  async getStats(rucher_id: string): Promise<any> {
    // Verify rucher exists
    const rucher = await rucherRepository.findById(rucher_id);
    if (!rucher) {
      throw new ApiError('Rucher not found', 404);
    }

    return await rucherRepository.getStats(rucher_id);
  }

  /**
   * Format rucher as GeoJSON feature
   */
  private formatRucherAsFeature(rucher: Rucher): any {
    const { location, ...properties } = rucher.toJSON() as any;
    return createFeature(properties, toGeoJSON(location));
  }

  /**
   * Format ruche as GeoJSON feature
   */
  private formatRucheAsFeature(ruche: Ruche): any {
    const { location, ...properties } = ruche.toJSON() as any;
    return createFeature(properties, toGeoJSON(location));
  }
}

export default new RucherService();
