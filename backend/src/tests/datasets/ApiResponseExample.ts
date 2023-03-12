import Chance from 'chance';

const chance = new Chance();

export const ApiResponseExample = {
  cod: '200',
  message: 0,
  cnt: 40,
  list: Array.from({ length: 6 }, () => ({
    dt: chance.integer({ min: 1676646000, max: 1676700000 }),
    main: {
      temp: chance.floating({ min: -10, max: 30 }),
      feels_like: chance.floating({ min: -10, max: 30 }),
      temp_min: chance.floating({ min: -10, max: 30 }),
      temp_max: chance.floating({ min: -10, max: 30 }),
      pressure: chance.integer({ min: 1000, max: 1030 }),
      sea_level: chance.integer({ min: 1000, max: 1030 }),
      grnd_level: chance.integer({ min: 1000, max: 1030 }),
      humidity: chance.integer({ min: 0, max: 100 }),
      temp_kf: chance.floating({ min: 0, max: 10 }),
    },
    weather: [
      {
        id: chance.integer({ min: 200, max: 800 }),
        main: chance.pickone([
          'Thunderstorm',
          'Drizzle',
          'Rain',
          'Snow',
          'Clear',
          'Clouds',
        ]),
        description: chance.sentence({ words: 2 }),
        icon: chance.string({ length: 3, pool: '01n23d' }),
      },
    ],
    clouds: {
      all: chance.integer({ min: 0, max: 100 }),
    },
    wind: {
      speed: chance.floating({ min: 0, max: 20 }),
      deg: chance.integer({ min: 0, max: 360 }),
      gust: chance.floating({ min: 0, max: 20 }),
    },
    visibility: chance.integer({ min: 0, max: 10000 }),
    pop: chance.floating({ min: 0, max: 1 }),
    sys: {
      pod: chance.pickone(['d', 'n']),
    },
    dt_txt: chance.date({ year: 2023, month: 2, day: 17 }),
  })),

  city: {
    id: chance.integer({ min: 100000, max: 999999 }),
    name: chance.city(),
    coord: {
      lat: chance.latitude({ min: 45, max: 50 }),
      lon: chance.longitude({ min: 25, max: 30 }),
    },
    country: chance.country({ full: true }),
    population: chance.integer({ min: 100000, max: 1000000 }),
    timezone: chance.integer({ min: -7200, max: 7200 }),
    sunrise: chance.timestamp(),
    sunset: chance.timestamp(),
  },
};
