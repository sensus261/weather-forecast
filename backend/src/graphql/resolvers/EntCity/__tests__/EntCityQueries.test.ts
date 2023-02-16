import 'reflect-metadata';

import { EntCity } from '@prisma/client';

import { gql, graphQLCall } from '@src/tests/graphql';
import prisma from '@src/utils/prisma';

let city: EntCity;

describe('EntCity queries tests', () => {
  beforeEach(async () => {
    const deleteEntCity = prisma.entCity.deleteMany();

    await prisma.$transaction([deleteEntCity]);
  });

  test('should be able to query a city by name', async () => {
    // TODO: Add test code here
    expect(true).toBe(true);
  });
});
