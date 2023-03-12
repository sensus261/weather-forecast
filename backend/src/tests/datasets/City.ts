import Chance from 'chance';

const chance = new Chance();

export const getMockedCityData = () => ({
  id: chance.guid({ version: 4 }),
  name: chance.city(),
  sanitizedName: chance.city(),
  state: chance.state(),
  country: chance.country(),
  lon: chance.longitude(),
  lat: chance.latitude(),
});
