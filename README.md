## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript is used to build this repository.

[JWT and passport] used for authentication
[PostgreSQL] used for database
[TCP] protocol for microservice
[Throttle] used for rate limiter

## Clone the repository 

## Project setup

## 1 Go to main folder

```bash
$ cd  ./main
```
## 1.1 Install dependency
```bash
$ pnpm install
```

## 1.2 create .env file and use env-local file variables

## 1.3 Compile and run the main service

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 2 Go to ingestion-services folder

```bash
$ cd  ./ingestion-services

```

## 1.1 Install dependency
```bash
$ pnpm install
```

## 1.2 create .env file and use env-local file variables

## 1.3 Compile and run the main service

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 3 Open browser at http://localhost:PORT/api/ (Swagger documentation available to test API end point)

