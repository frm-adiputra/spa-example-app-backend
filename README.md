# app-backend

> 

## Steps

Generate feathers app

```shell
feathers generate app 
```

Initialize prisma

```shell
npx prisma init --datasource-provider postgres
```

Install dotenv

```
npm install dotenv
```

Add dotenv initialization in `src/index.js` at first line

```js
require('dotenv').config();
```

### Database prototyping

Create database schema in `prisma/schema.prisma`.

Push database schema

```shell
npx prisma db push
```

### Database migration

Run database migration

```shell
npx prisma migrate dev --name init
```

Generate prisma client

```shell
npx prisma generate
```


## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/app-backend
    npm install
    ```

3. Start your app

    ```
    npm start
    ```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
