import { Op } from 'sequelize';
import { Rucher, RucherCreationAttributes } from '../models/Rucher';
import { Ruche } from '../models/Ruche';
import { Measurement } from '../models/Measurement';

export class RucherRepository {
  async create(data: RucherCreationAttributes): Promise<Rucher> {
    return await Rucher.create(data);
  }

  async findAll(userId?: number): Promise<Rucher[]> {
    const where: any = {};
    if (userId) where.userId = userId;

    return await Rucher.findAll({
      where,
      include: [
        {
          model: Ruche,
          as: 'ruches',
          attributes: ['id', 'name', 'status'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number): Promise<Rucher | null> {
    return await Rucher.findByPk(id, {
      include: [
        {
          model: Ruche,
          as: 'ruches',
          attributes: ['id', 'name', 'status', 'location'],
        },
      ],
    });
  }

  async update(id: number, data: Partial<RucherCreationAttributes>): Promise<Rucher | null> {
    const rucher = await Rucher.findByPk(id);
    if (!rucher) return null;
    
    await rucher.update(data);
    return rucher;
  }

  async delete(id: number): Promise<boolean> {
    const result = await Rucher.destroy({ where: { id } });
    return result > 0;
  }

  async getRuches(rucherId: number): Promise<Ruche[]> {
    return await Ruche.findAll({
      where: { rucherId },
      order: [['name', 'ASC']],
    });
  }

  async addRuche(rucherId: number, rucheId: number): Promise<Ruche | null> {
    const ruche = await Ruche.findByPk(rucheId);
    if (!ruche) return null;

    await ruche.update({ rucherId });
    return ruche;
  }

  async removeRuche(rucherId: number, rucheId: number): Promise<boolean> {
    const ruche = await Ruche.findOne({
      where: { id: rucheId, rucherId },
    });
    
    if (!ruche) return false;
    
    await ruche.update({ rucherId: null });
    return true;
  }

  async getAggregatedStats(rucherId: number): Promise<{
    totalWeight: number;
    totalGain: number;
    hiveCount: number;
    averageTemperature: number;
    averageHumidity: number;
  }> {
    const ruches = await Ruche.findAll({
      where: { rucherId },
      attributes: ['id'],
    });

    if (ruches.length === 0) {
      return {
        totalWeight: 0,
        totalGain: 0,
        hiveCount: 0,
        averageTemperature: 0,
        averageHumidity: 0,
      };
    }

    const rucheIds = ruches.map((r) => r.id);

    // Get latest measurements for each ruche
    const latestMeasurements = await Promise.all(
      rucheIds.map(async (rucheId) => {
        return await Measurement.findOne({
          where: { rucheId },
          order: [['timestamp', 'DESC']],
        });
      })
    );

    // Calculate total weight and averages
    let totalWeight = 0;
    let totalTemp = 0;
    let totalHumidity = 0;
    let tempCount = 0;
    let humidityCount = 0;

    latestMeasurements.forEach((m) => {
      if (m) {
        if (m.weight) totalWeight += parseFloat(m.weight.toString());
        if (m.temperature) {
          totalTemp += parseFloat(m.temperature.toString());
          tempCount++;
        }
        if (m.humidity) {
          totalHumidity += parseFloat(m.humidity.toString());
          humidityCount++;
        }
      }
    });

    // Calculate gain (30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldMeasurements = await Promise.all(
      rucheIds.map(async (rucheId) => {
        return await Measurement.findOne({
          where: {
            rucheId,
            timestamp: { [Op.lte]: thirtyDaysAgo },
          },
          order: [['timestamp', 'DESC']],
        });
      })
    );

    let oldTotalWeight = 0;
    oldMeasurements.forEach((m) => {
      if (m && m.weight) oldTotalWeight += parseFloat(m.weight.toString());
    });

    const totalGain = totalWeight - oldTotalWeight;

    return {
      totalWeight: parseFloat(totalWeight.toFixed(2)),
      totalGain: parseFloat(totalGain.toFixed(2)),
      hiveCount: ruches.length,
      averageTemperature: tempCount > 0 ? parseFloat((totalTemp / tempCount).toFixed(2)) : 0,
      averageHumidity: humidityCount > 0 ? parseFloat((totalHumidity / humidityCount).toFixed(2)) : 0,
    };
  }
}
