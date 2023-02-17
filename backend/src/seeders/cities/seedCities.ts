import * as fs from 'fs';

import prisma from '../../utils/prisma';

export const seedCities = async () => {
  const jsonData = fs.readFileSync('src/seeders/cities/cities.json', 'utf8');
  const data = JSON.parse(jsonData);

  for (const record of data) {
    await prisma.entCity.create({
      data: {
        name: record.name,
        state: record.state,
        country: record.country,
        lon: record.coord.lon,
        lat: record.coord.lat,
      },
    });
  }
};
