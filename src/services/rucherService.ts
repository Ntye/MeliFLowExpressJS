import { RucherRepository } from '../repositories/rucherRepository';
import { RucherCreationAttributes } from '../models/Rucher';

export class RucherService {
  private rucherRepository: RucherRepository;

  constructor() {
    this.rucherRepository = new RucherRepository();
  }

  async createRucher(data: RucherCreationAttributes) {
    return await this.rucherRepository.create(data);
  }

  async getAllRuchers(userId?: number) {
    return await this.rucherRepository.findAll(userId);
  }

  async getRucherById(id: number) {
    const rucher = await this.rucherRepository.findById(id);
    if (!rucher) {
      throw new Error('Rucher not found');
    }
    return rucher;
  }

  async updateRucher(id: number, data: Partial<RucherCreationAttributes>) {
    const rucher = await this.rucherRepository.update(id, data);
    if (!rucher) {
      throw new Error('Rucher not found');
    }
    return rucher;
  }

  async deleteRucher(id: number) {
    const deleted = await this.rucherRepository.delete(id);
    if (!deleted) {
      throw new Error('Rucher not found');
    }
    return { message: 'Rucher deleted successfully' };
  }

  async getRuches(rucherId: number) {
    await this.getRucherById(rucherId);
    return await this.rucherRepository.getRuches(rucherId);
  }

  async addRucheToRucher(rucherId: number, rucheId: number) {
    await this.getRucherById(rucherId);
    const ruche = await this.rucherRepository.addRuche(rucherId, rucheId);
    if (!ruche) {
      throw new Error('Ruche not found');
    }
    return ruche;
  }

  async removeRucheFromRucher(rucherId: number, rucheId: number) {
    await this.getRucherById(rucherId);
    const removed = await this.rucherRepository.removeRuche(rucherId, rucheId);
    if (!removed) {
      throw new Error('Ruche not found in this rucher');
    }
    return { message: 'Ruche removed from rucher successfully' };
  }

  async getAggregatedStats(rucherId: number) {
    await this.getRucherById(rucherId);
    return await this.rucherRepository.getAggregatedStats(rucherId);
  }
}
