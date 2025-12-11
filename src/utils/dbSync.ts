import { connectDatabase, sequelize } from '../config/database';
import { logger } from './logger';
import '../models';

const syncDatabase = async () => {
  try {
    await connectDatabase();
    
    // Force sync (WARNING: This will drop existing tables)
    // Use { alter: true } in production to safely modify tables
    await sequelize.sync({ force: false, alter: true });
    
    logger.info('Database synchronized successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Database sync failed:', error);
    process.exit(1);
  }
};

syncDatabase();
