import { seedCities } from './cities/seedCities';

export const seedDatabase = async () => {
  await seedCities();
};

seedDatabase()
  .then(() => {
    console.log('Database seeded');
  })
  .catch((error) => {
    console.log('Error seeding database', error);
  });
