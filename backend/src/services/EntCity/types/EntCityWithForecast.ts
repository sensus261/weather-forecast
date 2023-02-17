import { EntCity, EntForecast, EntForecastDetails } from '@prisma/client';

export type EntForecastWithForecastDetails = EntForecast & {
  forecastDetails: EntForecastDetails[];
};

export type EntCityWithAllForecastData = EntCity & {
  forecast: EntForecastWithForecastDetails | null;
};
