import { RucheRepository } from '../repositories/rucheRepository';
import { RucheCreationAttributes } from '../models/Ruche';
import { AlertService } from './alertService';

export class RucheService {
  private rucheRepository: RucheRepository;
  private alertService: AlertService;

  constructor() {
    this.rucheRepository = new RucheRepository();
    this.alertService = new AlertService();
  }

  async createRuche(data: RucheCreationAttributes) {
    return await this.rucheRepository.create(data);
  }

  async getAllRuches(filters?: { status?: string; rucherId?: number; userId?: number }) {
    return await this.rucheRepository.findAll(filters);
  }

  async getRucheById(id: number) {
    const ruche = await this.rucheRepository.findById(id);
    if (!ruche) {
      throw new Error('Ruche not found');
    }
    return ruche;
  }

  async updateRuche(id: number, data: Partial<RucheCreationAttributes>) {
    const ruche = await this.rucheRepository.update(id, data);
    if (!ruche) {
      throw new Error('Ruche not found');
    }
    return ruche;
  }

  async deleteRuche(id: number) {
    const deleted = await this.rucheRepository.delete(id);
    if (!deleted) {
      throw new Error('Ruche not found');
    }
    return { message: 'Ruche deleted successfully' };
  }

  async addMeasurement(
    rucheId: number,
    data: {
      weight?: number;
      temperature?: number;
      humidity?: number;
      signalStrength?: number;
      batteryLevel?: number;
      timestamp?: Date;
    }
  ) {
    // Verify ruche exists
    await this.getRucheById(rucheId);

    // Add measurement
    const measurement = await this.rucheRepository.addMeasurement(rucheId, data);

    // Evaluate alert rules
    await this.alertService.evaluateAlertsForMeasurement(measurement);

    return measurement;
  }

  async getMeasurements(rucheId: number, startDate?: Date, endDate?: Date) {
    await this.getRucheById(rucheId);
    return await this.rucheRepository.getMeasurements(rucheId, startDate, endDate);
  }

  async getLatestMeasurement(rucheId: number) {
    await this.getRucheById(rucheId);
    const measurement = await this.rucheRepository.getLatestMeasurement(rucheId);
    if (!measurement) {
      throw new Error('No measurements found for this ruche');
    }
    return measurement;
  }

  async getGainAnalytics(rucheId: number, days: number = 30) {
    await this.getRucheById(rucheId);
    return await this.rucheRepository.getGainAnalytics(rucheId, days);
  }

  async getComparisonStats(rucheId: number) {
    return await this.rucheRepository.getComparisonStats(rucheId);
  }
}
