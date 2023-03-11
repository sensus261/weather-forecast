# Weather forecast web app

## 🚧 Infrastructure

### ⛓ Git hooks

- This project uses git hooks (only pre-commit at the moment)
- To install the git hooks, you need to run

```bash
./infrastructure/scripts/git/install-git-hooks.sh
```

## 🚀 Start project


- This project is fully dockerized. That means that after you've configured your `.env` files in each project, you can simply run the following command to start the project:

```bash
docker-compose up
```

> TIP: Make sure to edit your `.env` files from both backend and frontend directories to fit your own configuration. 
> TIP: The project will NOT work correctly if you do not own an [OPEN WEATHER MAP API KEY](https://openweathermap.org/api) and pass it to the `.env` file.

## Backend

- [go to backend readme](./backend/README.md)


## Frontend

- [go to backend readme](./frontend/README.md)
