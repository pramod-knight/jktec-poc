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

## 1.4 whe your main service is started

![Main App Screenshot](https://media-hosting.imagekit.io/21f5c126ad054ee9/screenshot_1744007626592.png?Expires=1838615628&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=gcauu-YRnqVPVANNOZMROQN5WrMwOtft7-UVhl3xXQ-QnXmlFy0G9ZJTYqtbGfpFiQEVD3W6ZoE80H~So83e6AKhrFUZwZICJFkKjj5Ys0yljjERqVlVit5cL6cfcGnGzYf7Zwb5SXxCf--hRbGVx5Bt1F8QPex5LQzkeuYbYXA523N9pl5kg9sC0QrVbk0HeJT0Z1KnhHYBRhbnH~TyL7hrkewdhfWsKbW1p2TtEO0gc5Ln-xuJq~E2avRq5Uqn2-rBpawUeX98Xakpkc5jVHHR4Dt~-RnTG1ghwli9UInnnievGxOwFP8gtvnneKCt0MXIxyYgcaJ~nvL5Rr9JGQ__)

## 2 Go to ingestion-services folder

```bash
$ cd  ./ingestion-services

```

## 2.1 Install dependency
```bash
$ pnpm install
```

## 2.2 create .env file and use env-local file variables

## 2.3 Compile and run the main service

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 2.4 whe your ingestion service is started

![Ingestion App Screenshot](https://media-hosting.imagekit.io/fd6df8bb6aef4db8/screenshot_1744007888410.png?Expires=1838615890&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=MNQA2eG61s8LZFVbq4PA9mpC3WTENWM68vmNDf~sRmjgXn7-flyxTSyDzbTKVqhRc4~G~5oD41bbwqVAfqlSScfY1brE7XRvDyTjiXTifzQnKP~wUmWqILMqcFuGepCzTfEGBXdmnydh-S2Na-~5Ht-GRQ6LzIcHznw30~jc1cixc~hOwE7rDp7hUBWDUEJxlwLpKOz1mkvbNWHH29X3ye3OPFPLQtNxq3n8Z56MzGv97wLE1Nlq1Fk1cH1olevYSZ-BbqNgNqdjasVtywuYIIVGsnZ8-LdWVGELg0foZw0r6nRpEOj-cQHO~pDgIGqfECB8IfEz5DxRX4hCDEXESA__)


## 3 Open browser at http://localhost:PORT/api/ (Swagger documentation available to test API end point)

## 3.1 Swagger UI
![Swagger App Screenshot](
https://media-hosting.imagekit.io/d773471464954cc9/screenshot_1744008052093.png?Expires=1838616053&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=aORLlAQQb8Bfa6m5gQ7yc8RBDAvHFgg7mB4DfNB3kphX~r8yQOxiIangev1Zljk2IOfYe2GO6CIcH5zhAoeLys6EkqkPo90mY8QvXXvQxjx2tcIyiRjzkJa9LotGyTOmIUY9VdxIqWbcLCSmWW4DLyphV6pLcupeltixT6HQhrB0k7hY13Si~bKm2T80~FGqIre6CSgc-jYj4L5rZscqJ1Wd7cwbc4Va1ZXLpAufEvlsEjlV0DvkdoEnNb1TrdePCcht9pVxUFKwjQRr5nRYcFMtDZPdJ1ZNhYN~RfktZoy0EBI0KIzXxYq9qAZjgn6oReE01vheAunFweVYzbqJFA__)


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