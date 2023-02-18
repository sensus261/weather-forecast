import * as fs from 'fs';

import removeAccents from 'remove-accents';

import prisma from '../../utils/prisma';

export const seedCities = async () => {
  await prisma.entCity.deleteMany();

  const jsonData = fs.readFileSync('src/seeders/cities/cities.json', 'utf8');
  const data = JSON.parse(jsonData);

  const entCityData = new Set();
  const result = [];

  for (const record of data) {
    if (entCityData.has(record.name)) {
      continue;
    }

    entCityData.add(record.name);

    result.push({
      name: record.name,
      sanitizedName: removeAccents(record.name),
      state: record.state,
      country: record.country,
      lon: record.coord.lon,
      lat: record.coord.lat,
    });
  }

  const dataChunks = [];
  const chunkSize = 10000;
  for (let i = 0; i < result.length; i += chunkSize) {
    dataChunks.push(result.slice(i, i + chunkSize));
  }

  for (const chunk of dataChunks) {
    await prisma.entCity.createMany({
      data: chunk,
    });
  }
};
