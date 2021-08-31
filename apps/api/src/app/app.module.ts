import { Module } from '@nestjs/common';
import { CouchDbModule } from 'nest-couchdb';
import { UnitsModule } from '../unit/unit.module';

import { AppController } from './app.controller';
const couchDbUrl = process.env.COUCHDB_URL ?? 'http://localhost:5984';
const couchDbUser = process.env.COUCHDB_USER ?? 'admin';
const couchDbPassword = process.env.COUCHDB_PASSWORD ?? 'password';

@Module({
  imports: [
    CouchDbModule.forRoot({
      url: couchDbUrl,
      username: couchDbUser,
      userpass: couchDbPassword,
      requestDefaults: { jar: true }
    }),
    UnitsModule
  ],
  controllers: [AppController]
})
export class AppModule {}
