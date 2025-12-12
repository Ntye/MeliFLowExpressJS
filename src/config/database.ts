import { Sequelize } from 'sequelize';
import environment from './environment';
import logger from '../utils/logger';

/**
 * Initialize Sequelize instance with PostgreSQL/PostGIS configuration
 */
const sequelize = new Sequelize({
  host: environment.database.host,
  port: environment.database.port,
  database: environment.database.name,
  username: environment.database.user,
  password: environment.database.password,
  dialect: 'postgres',
  logging: environment.database.logging ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
});

/**
 * Test database connection
 */
export async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
}

/**
 * Sync database models (use with caution in production)
 */
export async function syncDatabase(force = false): Promise<void> {
  try {
    await sequelize.sync({ force });
    logger.info(`Database synchronized ${force ? '(forced)' : ''}`);
  } catch (error) {
    logger.error('Error synchronizing database:', error);
    throw error;
  }
}

export default sequelize;
