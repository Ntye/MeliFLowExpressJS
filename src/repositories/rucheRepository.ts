import { Op, literal } from 'sequelize';
import { Ruche, Measurement, Rucher } from '../models';
import { RucheCreationAttributes } from '../models/Ruche';
import { MeasurementCreationAttributes } from '../models/Measurement';

/**
 * Repository for Ruche (Hive) data access
 */
export class RucheRepository {
  /**
   * Create a new ruche
   */
  async create(data: RucheCreationAttributes): Promise<Ruche> {
    return await Ruche.create(data);
  }

  /**
   * Find ruche by ID
   */
  async findById(id: string): Promise<Ruche | null> {
    return await Ruche.findByPk(id, {
      include: [
        {
          model: Rucher,
          as: 'rucher',
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  /**
   * Find all ruches with optional filters
   */
  async findAll(filters: {
    active?: boolean;
    rucher_id?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    limit?: number;
    offset?: number;
  }): Promise<Ruche[]> {
    const where: any = {};

    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    if (filters.rucher_id) {
      where.rucher_id = filters.rucher_id;
    }

    // Spatial filtering by radius
    if (filters.latitude && filters.longitude && filters.radius) {
      const point = `ST_SetSRID(ST_MakePoint(${filters.longitude}, ${filters.latitude}), 4326)`;
      where[Op.and] = literal(
        `ST_DWithin(location::geography, ${point}::geography, ${filters.radius})`
      );
    }

    return await Ruche.findAll({
      where,
      include: [
        {
          model: Rucher,
          as: 'rucher',
          attributes: ['id', 'name'],
        },
      ],
      limit: filters.limit || 50,
      offset: filters.offset || 0,
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Update ruche by ID
   */
  async update(id: string, data: Partial<RucheCreationAttributes>): Promise<Ruche | null> {
    const ruche = await Ruche.findByPk(id);
    if (!ruche) return null;

    await ruche.update(data);
    return ruche;
  }

  /**
   * Delete ruche by ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await Ruche.destroy({ where: { id } });
    return result > 0;
  }

  /**
   * Add measurement to ruche
   */
  async addMeasurement(
    ruche_id: string,
    data: MeasurementCreationAttributes
  ): Promise<Measurement> {
    return await Measurement.create({ ...data, ruche_id });
  }

  /**
   * Get measurements for a ruche
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
    const where: any = { ruche_id };

    if (filters.start_date || filters.end_date) {
      where.timestamp = {};
      if (filters.start_date) {
        where.timestamp[Op.gte] = filters.start_date;
      }
      if (filters.end_date) {
        where.timestamp[Op.lte] = filters.end_date;
      }
    }

    return await Measurement.findAll({
      where,
      limit: filters.limit || 100,
      offset: filters.offset || 0,
      order: [['timestamp', 'DESC']],
    });
  }

  /**
   * Get latest measurement for a ruche
   */
  async getLatestMeasurement(ruche_id: string): Promise<Measurement | null> {
    return await Measurement.findOne({
      where: { ruche_id },
      order: [['timestamp', 'DESC']],
    });
  }

  /**
   * Get weight gain analytics
   */
  async getWeightGainAnalytics(
    ruche_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<any> {
    const measurements = await Measurement.findAll({
      where: {
        ruche_id,
        timestamp: {
          [Op.between]: [start_date, end_date],
        },
        weight: {
          [Op.ne]: null,
        },
      },
      order: [['timestamp', 'ASC']],
    });

    if (measurements.length === 0) {
      return {
        total_gain: 0,
        average_daily_gain: 0,
        measurements_count: 0,
        start_weight: null,
        end_weight: null,
      };
    }

    const startWeight = measurements[0].weight || 0;
    const endWeight = measurements[measurements.length - 1].weight || 0;
    const totalGain = endWeight - startWeight;

    const days = Math.ceil(
      (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24)
    );
    const averageDailyGain = days > 0 ? totalGain / days : 0;

    return {
      total_gain: totalGain,
      average_daily_gain: averageDailyGain,
      measurements_count: measurements.length,
      start_weight: startWeight,
      end_weight: endWeight,
      start_date,
      end_date,
    };
  }

  /**
   * Get comparison statistics with other hives
   */
  async getComparisonStats(ruche_id: string): Promise<any> {
    const ruche = await Ruche.findByPk(ruche_id);
    if (!ruche) return null;

    const latestMeasurement = await this.getLatestMeasurement(ruche_id);

    // Get average statistics from all active hives
    const avgStats = await Measurement.findOne({
      attributes: [
        [literal('AVG(weight)'), 'avg_weight'],
        [literal('AVG(temperature)'), 'avg_temperature'],
        [literal('AVG(humidity)'), 'avg_humidity'],
      ],
      where: {
        timestamp: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      raw: true,
    });

    return {
      ruche_id,
      latest_measurement: latestMeasurement,
      comparison_with_average: avgStats,
    };
  }
}

export default new RucheRepository();
