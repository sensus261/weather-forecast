import Chance from 'chance';

const chance = new Chance();

export const getMockedForecastDetailsData = () => ({
  id: chance.guid({ version: 4 }),
  dt: chance.integer({ min: 1, max: 100 }),
  temperature: chance.floating({ min: -50, max: 50 }),
  feelsLike: chance.floating({ min: -50, max: 50 }),
  tempMin: chance.floating({ min: -50, max: 50 }),
  tempMax: chance.floating({ min: -50, max: 50 }),
  pressure: chance.integer({ min: 800, max: 1200 }),
  seaLevel: chance.integer({ min: 0, max: 500 }),
  grndLevel: chance.integer({ min: 0, max: 500 }),
  humidity: chance.integer({ min: 0, max: 100 }),
  tempKf: chance.floating({ min: 0, max: 10 }),
  title: chance.string(),
  description: chance.sentence(),
  icon: chance.string(),
  clouds: chance.integer({ min: 0, max: 100 }),
  windSpeed: chance.floating({ min: 0, max: 100 }),
  windDeg: chance.integer({ min: 0, max: 360 }),
  windGust: chance.floating({ min: 0, max: 100 }),
  visibility: chance.integer({ min: 0, max: 10000 }),
  pop: chance.floating({ min: 0, max: 1 }),
  sysPod: chance.string(),
  dateTime: chance.date({ string: true }).toString(),
});
