# Weather forecast backend app

## Requirements

- Node version 18.6.0 / 19.0.0 (only tested on these, most likely works on other versions aswell)



## Project setup

### Setup your env file

- Setup the `.env` file (don't forget the api key aswell, otherwise the data won't be updated from the api)

### Install dependencies

```
yarn
```

### Start docker containers

```
docker-compose up
```

### Bootstrap the database

```
yarn db:bootstrap
```

### Start in development mode

```
yarn start:dev
```

