<h1 align="center">The Act App</h1>

### General purpose, offline first web and mobile applications for goal setting, achievement tracking, and getting things done. Reimagining of [Points](https://github.com/joe307bad/points)

#### Technical overview

This repository is an exploratory exercise and case study of three concepts: **[offline-first](https://hasura.io/blog/design-guide-to-offline-first-apps/) mobile applications, code sharing via monorepos (using [Nx](https://github.com/nrwl/nx)), and [microservices](https://microservices.io/patterns/microservices.html)**. The foremost technical goals of The Act App are to investigate these concepts, determine best practices, and apply them to a real-world idea.

### Applications, libraries, and architecture

#### `/apps/api`

- This application is the layer between `web`/`mobile` and the CouchDB instance. In adherence with the offline first ideology, the primary responsibility of this application is to sync data between clients and the CouchDB instance.
- Primary tools
  - [NestJS](https://github.com/nestjs/nest) ([TypeScript](https://github.com/microsoft/TypeScript))
  - [CouchDB](https://github.com/apache/couchdb)

#### `/apps/mobile`

- This application is the Android and iOS mobile applications in a single codebase. This is the main client facing consumer of the `api` application. Offline-first ideology dictates the need to maintain a database of information on the user's device and the ability to sync and persist any information to the `api` application.
- Primary tools
  - [ReScript](https://github.com/rescript-lang) ([`rescript-react`](https://github.com/rescript-lang/rescript-react))
  - [React Native](https://github.com/facebook/react-native) ([`rescript-react-native`](https://github.com/rescript-react-native))
  - [React Native Paper](https://github.com/callstack/react-native-paper) ([`rescript-react-native-paper`](https://github.com/rescript-react-native/paper))
  - [React Navigation](https://github.com/react-navigation/react-navigation) ([`rescript-react-navigation`](https://github.com/rescript-react-native/rescript-react-navigation))
  - [WatermelonDB](https://github.com/Nozbe/WatermelonDB) ([SQLite](https://github.com/sqlite/sqlite))

#### `/apps/web`

- This application is (currently) an administration portal to view tabular data affected by the client. Determining cross cutting concerns between `mobile` and `web` facilitates the discovery of code-sharing best practices.
- Primary tools
  - [React](https://github.com/facebook/react) (TypeScript)
  - [Material UI](https://github.com/mui-org/material-ui)
  - WatermelonDB ([LokiDB](https://github.com/LokiJS-Forge/LokiDB))

#### `/libs/data/core`

- This library brings the entirety of data/schema construction and maintenance to the frontend. The `api` application simply takes what this library constructs and organizes it as documents in CouchDB. This project also contains utilites for getting and observing data as it moves through the `web` and `mobile` applications.
- Primary tools
  - TypeScript
  - [TSyringe](https://github.com/microsoft/tsyringe)
  - WatermelonDB

#### `/libs/data/rn` & `/libs/data/web`

- These two libraries handle the diverging data configurations of the `web` and `mobile` applications. Not everything can or should be shared with both applications.
- Primary tools
  - TypeScript
- Mobile tools
  - [Keycloak](https://github.com/keycloak/keycloak) as an OIDC provider ([`@react-keycloak/native`](https://github.com/react-keycloak/react-native-keycloak))

#### `docker-compose.yml`

- This file is for managing the required services to run The Act App.
- Services
  - CouchDB
  - Keycloak
  - [PostgreSQL](https://github.com/postgres/postgres)
