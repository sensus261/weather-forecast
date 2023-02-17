import { logger } from '@src/utils';

import { seedCities } from './cities/seedCities';

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
