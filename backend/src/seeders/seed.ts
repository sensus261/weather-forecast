import { seedCities } from './cities/seedCities';
import logger from '../utils/logger';

export const seedDatabase = async () => {
  await seedCities();
};

seedDatabase()
  .then(() => {
    logger.info('Database seeded!');
  })
  .catch((error) => {
    logger.error('Error seeding database:', error);
  });
