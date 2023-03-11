# Weather forecast backend app

This is the backend app for the Weather Forecast web application. It is built using **Node.js**, **Express**, **GraphQL**, **TypeGraphQL**, and **Prisma**.

## Features

- Fetch weather forecasts from the OpenWeatherMap API
- Store weather forecasts in a database (PostgreSQL)
- Expose a GraphQL API that allows the frontend to query and mutate weather forecast data

## Getting Started

To get started, you need to:

1. Set up your `.env` file with the necessary configuration variables, including the OpenWeatherMap API key.
2. Bootstrap the database by running the following command:

```
yarn db:bootstrap
```


## Project Structure

- `src/server.ts`: The entrypoint for the server.
- `src/app.ts`: The main application (with middlewares, servers, db connections etc).
- `src/services/`: The services that are used in resolvers. Contain certain operations based on entities.
- `src/graphql/`: The GraphQL modules used. Here we define GraphQL entities, resolvers, middlewares.
- `src/seeders/`: The seeders used in the app for development purposes.
- `src/tests/`: Pretty much helper stuff for project's tests.
- `src/utils/`: Useful stuff. Stuff like: logger, prisma (singleton), validateEnv etc.

For more information about the project itself, please refer to the [project readme](../README.md).

I hope that this project will be useful to you! If you have any questions or feedback, please feel free to reach out to us.
