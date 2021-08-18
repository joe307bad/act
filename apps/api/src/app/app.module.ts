import { Module } from '@nestjs/common';
import { CouchDbModule } from 'nest-couchdb';
import { UnitsModule } from '../unit/unit.module';

import { AppController } from './app.controller';

const couchDbUrl =
  process.env.COUCH_DB_URL ?? 'http://localhost:5984';

@Module({
  imports: [
    CouchDbModule.forRoot({
      url: couchDbUrl,
      username: 'admin',
      userpass: 'password',
      requestDefaults: { jar: true }
    }),
    UnitsModule
  ],
  controllers: [AppController]
})
export class AppModule {}
