import { Op } from 'sequelize';
import { Ruche, RucheCreationAttributes } from '../models/Ruche';
import { Measurement } from '../models/Measurement';
import { Rucher } from '../models/Rucher';

export class RucheRepository {
  async create(data: RucheCreationAttributes): Promise<Ruche> {
    return await Ruche.create(data);
  }

  async findAll(filters?: {
    status?: string;
    rucherId?: number;
    userId?: number;
  }): Promise<Ruche[]> {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.rucherId) where.rucherId = filters.rucherId;
    if (filters?.userId) where.userId = filters.userId;

    return await Ruche.findAll({
      where,
      include: [{ model: Rucher, as: 'rucher', attributes: ['id', 'name', 'location'] }],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number): Promise<Ruche | null> {
    return await Ruche.findByPk(id, {
      include: [{ model: Rucher, as: 'rucher', attributes: ['id', 'name', 'location'] }],
    });
  }

  async update(id: number, data: Partial<RucheCreationAttributes>): Promise<Ruche | null> {
    const ruche = await Ruche.findByPk(id);
    if (!ruche) return null;

    await ruche.update(data);
    return ruche;
  }

  async delete(id: number): Promise<boolean> {
    const result = await Ruche.destroy({ where: { id } });
    return result > 0;
  }

  async getMeasurements(rucheId: number, startDate?: Date, endDate?: Date): Promise<Measurement[]> {
    const where: any = { rucheId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = startDate;
      if (endDate) where.timestamp[Op.lte] = endDate;
    }

    return await Measurement.findAll({
      where,
      order: [['timestamp', 'DESC']],
    });
  }

  async getLatestMeasurement(rucheId: number): Promise<Measurement | null> {
    return await Measurement.findOne({
      where: { rucheId },
      order: [['timestamp', 'DESC']],
    });
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
  ): Promise<Measurement> {
    return await Measurement.create({
      rucheId,
      ...data,
      timestamp: data.timestamp || new Date(),
    });
  }

  async getGainAnalytics(
    rucheId: number,
    days: number = 30
  ): Promise<{
    totalGain: number;
    averageDailyGain: number;
    measurements: number;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const measurements = await Measurement.findAll({
      where: {
        rucheId,
        timestamp: { [Op.gte]: startDate },
        weight: { [Op.ne]: null as any },
      },
      order: [['timestamp', 'ASC']],
    });

    if (measurements.length < 2) {
      return { totalGain: 0, averageDailyGain: 0, measurements: measurements.length };
    }

    const firstWeight = measurements[0].weight || 0;
    const lastWeight = measurements[measurements.length - 1].weight || 0;
    const totalGain = lastWeight - firstWeight;
    const averageDailyGain = totalGain / days;

    return {
      totalGain: parseFloat(totalGain.toFixed(2)),
      averageDailyGain: parseFloat(averageDailyGain.toFixed(2)),
      measurements: measurements.length,
    };
  }

  async getComparisonStats(rucheId: number): Promise<{
    ruche: {
      id: number;
      name: string;
      averageWeight: number;
      averageTemperature: number;
      averageHumidity: number;
    };
    averages: {
      weight: number;
      temperature: number;
      humidity: number;
    };
  }> {
    const ruche = await this.findById(rucheId);
    if (!ruche) {
      throw new Error('Ruche not found');
    }

    // Get ruche's own stats
    const rucheMeasurements = await Measurement.findAll({
      where: { rucheId },
      attributes: [
        [Measurement.sequelize!.fn('AVG', Measurement.sequelize!.col('weight')), 'avgWeight'],
        [Measurement.sequelize!.fn('AVG', Measurement.sequelize!.col('temperature')), 'avgTemp'],
        [Measurement.sequelize!.fn('AVG', Measurement.sequelize!.col('humidity')), 'avgHumidity'],
      ],
      raw: true,
    });

    // Get all ruches stats for comparison
    const allStats = await Measurement.findAll({
      attributes: [
        [Measurement.sequelize!.fn('AVG', Measurement.sequelize!.col('weight')), 'avgWeight'],
        [Measurement.sequelize!.fn('AVG', Measurement.sequelize!.col('temperature')), 'avgTemp'],
        [Measurement.sequelize!.fn('AVG', Measurement.sequelize!.col('humidity')), 'avgHumidity'],
      ],
      raw: true,
    });

    const rucheStats: any = rucheMeasurements[0];
    const globalStats: any = allStats[0];

    return {
      ruche: {
        id: ruche.id,
        name: ruche.name,
        averageWeight: parseFloat(rucheStats.avgWeight || 0),
        averageTemperature: parseFloat(rucheStats.avgTemp || 0),
        averageHumidity: parseFloat(rucheStats.avgHumidity || 0),
      },
      averages: {
        weight: parseFloat(globalStats.avgWeight || 0),
        temperature: parseFloat(globalStats.avgTemp || 0),
        humidity: parseFloat(globalStats.avgHumidity || 0),
      },
    };
  }
}
