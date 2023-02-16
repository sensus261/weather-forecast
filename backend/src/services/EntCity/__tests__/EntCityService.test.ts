import 'reflect-metadata';

import prisma from '@src/utils/prisma';

describe('EntCity entity service tests', () => {
  beforeEach(async () => {
    const deleteEntCity = prisma.entCity.deleteMany();

    await prisma.$transaction([deleteEntCity]);
  });

  test('should implement this code', async () => {
    expect(true).toBe(true);
  });
});
