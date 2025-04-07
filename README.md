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


## Types of Users
1. Admin
  
  This user can any operations in the application such as

  - Registering new user
  - CRUD of Document
  - Create and get details of an Ingestion

2. Editor

  This type of user can perform any operation on the document

  - CRUD of Document
  - Create and Details of ingestion

3. Viewer

  This type of user can perform any operation on the document

  - Details of ingestion
  - Read any document

## User Authentication

The codes for authentication can be found inside of main folder under the auth module. Passport's JWT auth is used for this purpose. An Auth guard is places on all those controller api's which requires user to be authenticated.

Please see these locations,

- `main/src/auth/jwt-auth.guard.ts`

- `main/src/auth/strategy/auth.jwt.strategy.ts` 

## User Authorization

RolesGuard is a robust rule engine module which is default for bulding RBAC mechanism, please find more about this at https://docs.nestjs.com/guards#role-based-authentication

The above module is used along with a decorator which is used to tag the controller apis with the appropriate RBAC for invoking.

`/main/src/auth/role.decorator.ts`

The guard is then used to identify the invoker's list of permission and whether the invoker can successfully execute the target api.

`main/src/auth/role.guard.ts`


## mocked Ingestion Service

The ingestion service is another Nestjs microservice that run along with main. It has apis to add and get details of the ingestion as `@MessagePattern` with linked to their command.

NOTE: 
Once a new ingestion is added,  to update it's status an event is fired. That event is then asynchronously handled to update it's status to success / failed.