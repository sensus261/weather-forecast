import { cleanEnv, port, str } from 'envalid';

export enum EnvironmentMode {
  DEV = 'development',
  TEST = 'test',
  PRODUCTION = 'production',
  STAGING = 'staging',
}

const validateEnv = (): void => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: [
        EnvironmentMode.DEV,
        EnvironmentMode.TEST,
        EnvironmentMode.PRODUCTION,
        EnvironmentMode.STAGING,
      ],
    }),
    PORT: port(),
    REDIS_HOST: str(),
    OPEN_WEATHER_MAP_API_KEY: str(),
  });
};

export default validateEnv;
