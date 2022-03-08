# Alight server

Using [Nest](https://github.com/nestjs/nest) framework.

## Development

Default environment variables in `.env-sample`

### With docker

Install and start [Docker](https://docs.docker.com/get-docker/)

make sure port 8519, 8520 are available ( not taken )

run dev:

```bash
$ sh ./script/start-dev-docker.sh
```

app will be available at <localhost:8519/docs>

### Manually

-   install [nodejs](https://nodejs.org/en/download/) version 12
-   install [yarn](https://classic.yarnpkg.com/en/docs/install)
-   install [mongodb](https://docs.mongodb.com/manual/administration/install-community/) community
-   install packages:
    ```bash
    $ yarn install --frozen-lockfile
    ```
-   start db:
    ```bash
    $ sh ./script/start-local-db.sh
    ```
-   run app in dev mode:
    ```bash
    $ yarn run start:dev
    ```

app will be available at <localhost:3000/docs>

## Installation

```bash
$ yarn install --frozen-lockfile
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

Default openapi swagger path: <localhost:3000/docs>

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
