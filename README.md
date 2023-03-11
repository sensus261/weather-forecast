# Weather forecast web app

This web application provides a simple interface for searching weather forecasts by city. It is built using **TypeScript**, **Node.js**, **Express**, **GraphQL**, **TypeGraphQL**, and **Prisma** for the backend, and **TypeScript**, **Vite**, **Vue 3**, **Apollo**, and **Vuetify** for the frontend.

## Features

- Search weather forecasts by city
- Update weather forecasts in our database by fetching new data from the OpenWeatherMap API

## Getting Started

To start the project, you need to:

1. Set up your `.env` files in both the backend and frontend directories.
2. Obtain an OpenWeatherMap API key and pass it to the `.env` file.
3. Run the following command to start the project:

```
docker-compose up
```

## Backend

The backend is built using **Node.js**, **Express**, **GraphQL**, **TypeGraphQL**, and **Prisma**. It provides a GraphQL API that allows the frontend to search for weather forecasts and update the forecasts in our database.

For more information, please refer to the [backend readme](./backend/README.md).

## Frontend

The frontend is built using **TypeScript**, **Vite**, **Vue 3**, **Apollo**, and **Vuetify**. It provides a simple user interface that allows the user to search for weather forecasts by city and view the forecast details.

For more information, please refer to the [frontend readme](./frontend/README.md).

## Infrastructure

The project uses git hooks to automate certain tasks, such as running tests before committing code. To install the git hooks, you need to run the following command:

```
./infrastructure/scripts/git/install-git-hooks.sh
```


I hope that this project will be useful to you! If you have any questions or feedback, please feel free to reach out!

