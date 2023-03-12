import Chance from 'chance';

const chance = new Chance();

export const getMockedForecastData = () => ({
  id: chance.guid({ version: 4 }),
  name: chance.name(),
  country: chance.country(),
  latitude: chance.latitude(),
  longitude: chance.longitude(),
  sunrise: chance.timestamp(),
  sunset: chance.timestamp(),
  population: chance.integer({ min: 100000, max: 1000000 }),
  timezone: chance.integer({ min: -7200, max: 7200 }),
});
