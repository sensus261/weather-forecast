import { EntCity, EntForecast } from '@prisma/client';

export type EntCityWithForecast = EntCity & {
  forecast: EntForecast | null;
};
