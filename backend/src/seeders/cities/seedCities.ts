import * as fs from 'fs';

import removeAccents from 'remove-accents';

import prisma from '../../utils/prisma';

export const seedCities = async () => {
  const jsonData = fs.readFileSync('src/seeders/cities/cities.json', 'utf8');
  const data = JSON.parse(jsonData);

  // TODO: Run these in parallel.. takes about 200 seconds to run LOL

  for (const record of data) {
    await prisma.entCity.create({
      data: {
        name: record.name,
        sanitizedName: removeAccents(record.name),
        state: record.state,
        country: record.country,
        lon: record.coord.lon,
        lat: record.coord.lat,
      },
    });
  }
};
