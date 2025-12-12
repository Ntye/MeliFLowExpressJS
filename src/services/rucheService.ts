import rucheRepository from '../repositories/rucheRepository';
import alertService from './alertService';
import { Ruche, Measurement } from '../models';
import { RucheCreationAttributes } from '../models/Ruche';
import { MeasurementCreationAttributes } from '../models/Measurement';
import { createFeature, createFeatureCollection, toGeoJSON } from '../utils/spatial';
import { ApiError } from '../middleware/errorHandler';

/**
 * Service for Ruche (Hive) business logic
 */
export class RucheService {
  /**
   * Create a new ruche
   */
  async createRuche(data: RucheCreationAttributes): Promise<any> {
    const ruche = await rucheRepository.create(data);
    return this.formatRucheAsFeature(ruche);
  }

  /**
   * Get ruche by ID
   */
  async getRucheById(id: string): Promise<any> {
    const ruche = await rucheRepository.findById(id);
    if (!ruche) {
      throw new ApiError('Ruche not found', 404);
    }
    return this.formatRucheAsFeature(ruche);
  }

  /**
   * Get all ruches with filters
   */
  async getAllRuches(filters: {
    active?: boolean;
    rucher_id?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    limit?: number;
    offset?: number;
  }): Promise<any> {
    const ruches = await rucheRepository.findAll(filters);
    const features = ruches.map((ruche) => this.formatRucheAsFeature(ruche));
    return createFeatureCollection(features);
  }

  /**
   * Update ruche
   */
  async updateRuche(id: string, data: Partial<RucheCreationAttributes>): Promise<any> {
    const ruche = await rucheRepository.update(id, data);
    if (!ruche) {
      throw new ApiError('Ruche not found', 404);
    }
    return this.formatRucheAsFeature(ruche);
  }

  /**
   * Delete ruche
   */
  async deleteRuche(id: string): Promise<void> {
    const deleted = await rucheRepository.delete(id);
    if (!deleted) {
      throw new ApiError('Ruche not found', 404);
    }
  }

  /**
   * Add measurement to ruche
   */
  async addMeasurement(ruche_id: string, data: MeasurementCreationAttributes): Promise<Measurement> {
    // Verify ruche exists
    const ruche = await rucheRepository.findById(ruche_id);
    if (!ruche) {
      throw new ApiError('Ruche not found', 404);
    }

    const measurement = await rucheRepository.addMeasurement(ruche_id, data);

    // Evaluate alerts for this measurement
    await alertService.evaluateAlertsForMeasurement(measurement);

    return measurement;
  }

  /**
   * Get measurements for ruche
   */
  async getMeasurements(
    ruche_id: string,
    filters: {
      start_date?: Date;
      end_date?: Date;
      limit?: number;
      offset?: number;
    }
  ): Promise<Measurement[]> {
    // Verify ruche exists
    const ruche = await rucheRepository.findById(ruche_id);
    if (!ruche) {
      throw new ApiError('Ruche not found', 404);
    }

    return await rucheRepository.getMeasurements(ruche_id, filters);
  }

  /**
   * Get latest measurement for ruche
   */
  async getLatestMeasurement(ruche_id: string): Promise<Measurement> {
    // Verify ruche exists
    const ruche = await rucheRepository.findById(ruche_id);
    if (!ruche) {
      throw new ApiError('Ruche not found', 404);
    }

    const measurement = await rucheRepository.getLatestMeasurement(ruche_id);
    if (!measurement) {
      throw new ApiError('No measurements found for this ruche', 404);
    }

    return measurement;
  }

  /**
   * Get weight gain analytics
   */
  async getWeightGainAnalytics(
    ruche_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<any> {
    // Verify ruche exists
    const ruche = await rucheRepository.findById(ruche_id);
    if (!ruche) {
      throw new ApiError('Ruche not found', 404);
    }

    return await rucheRepository.getWeightGainAnalytics(ruche_id, start_date, end_date);
  }

  /**
   * Get comparison statistics
   */
  async getComparisonStats(ruche_id: string): Promise<any> {
    const stats = await rucheRepository.getComparisonStats(ruche_id);
    if (!stats) {
      throw new ApiError('Ruche not found', 404);
    }

    return stats;
  }

  /**
   * Format ruche as GeoJSON feature
   */
  private formatRucheAsFeature(ruche: Ruche): any {
    const { location, ...properties } = ruche.toJSON() as any;
    return createFeature(properties, toGeoJSON(location));
  }
}

export default new RucheService();
