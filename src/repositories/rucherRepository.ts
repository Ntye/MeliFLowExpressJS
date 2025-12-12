import { Op, literal } from 'sequelize';
import { Rucher, Ruche, Measurement } from '../models';
import { RucherCreationAttributes } from '../models/Rucher';

/**
 * Repository for Rucher (Apiary) data access
 */
export class RucherRepository {
  /**
   * Create a new rucher
   */
  async create(data: RucherCreationAttributes): Promise<Rucher> {
    return await Rucher.create(data);
  }

  /**
   * Find rucher by ID
   */
  async findById(id: string): Promise<Rucher | null> {
    return await Rucher.findByPk(id);
  }

  /**
   * Find all ruchers with optional filters
   */
  async findAll(filters: {
    active?: boolean;
    user_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<Rucher[]> {
    const where: any = {};

    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    if (filters.user_id) {
      where.user_id = filters.user_id;
    }

    return await Rucher.findAll({
      where,
      limit: filters.limit || 50,
      offset: filters.offset || 0,
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Update rucher by ID
   */
  async update(id: string, data: Partial<RucherCreationAttributes>): Promise<Rucher | null> {
    const rucher = await Rucher.findByPk(id);
    if (!rucher) return null;

    await rucher.update(data);
    return rucher;
  }

  /**
   * Delete rucher by ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await Rucher.destroy({ where: { id } });
    return result > 0;
  }

  /**
   * Get all ruches belonging to a rucher
   */
  async getRuches(rucher_id: string): Promise<Ruche[]> {
    return await Ruche.findAll({
      where: { rucher_id },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Add ruche to rucher
   */
  async addRuche(rucher_id: string, ruche_id: string): Promise<Ruche | null> {
    const ruche = await Ruche.findByPk(ruche_id);
    if (!ruche) return null;

    await ruche.update({ rucher_id });
    return ruche;
  }

  /**
   * Remove ruche from rucher
   */
  async removeRuche(rucher_id: string, ruche_id: string): Promise<Ruche | null> {
    const ruche = await Ruche.findOne({
      where: { id: ruche_id, rucher_id },
    });
    if (!ruche) return null;

    await ruche.update({ rucher_id: null });
    return ruche;
  }

  /**
   * Get aggregated statistics for a rucher
   */
  async getStats(rucher_id: string): Promise<any> {
    // Count total ruches
    const totalRuches = await Ruche.count({
      where: { rucher_id },
    });

    // Count active ruches
    const activeRuches = await Ruche.count({
      where: { rucher_id, active: true },
    });

    // Get latest measurements from all ruches in the apiary
    const ruches = await Ruche.findAll({
      where: { rucher_id },
      attributes: ['id'],
    });

    const rucheIds = ruches.map((r) => r.id);

    if (rucheIds.length === 0) {
      return {
        total_ruches: 0,
        active_ruches: 0,
        latest_measurements: [],
        aggregate_stats: null,
      };
    }

    // Get aggregate statistics from recent measurements
    const aggregateStats = await Measurement.findOne({
      attributes: [
        [literal('AVG(weight)'), 'avg_weight'],
        [literal('AVG(temperature)'), 'avg_temperature'],
        [literal('AVG(humidity)'), 'avg_humidity'],
        [literal('MIN(battery_level)'), 'min_battery'],
        [literal('MAX(timestamp)'), 'latest_timestamp'],
      ],
      where: {
        ruche_id: {
          [Op.in]: rucheIds,
        },
        timestamp: {
          [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      raw: true,
    });

    return {
      total_ruches: totalRuches,
      active_ruches: activeRuches,
      aggregate_stats: aggregateStats,
    };
  }
}

export default new RucherRepository();
