import { Module } from '@nestjs/common';
import { CouchDbModule } from 'nest-couchdb';
import { UnitsModule } from '../unit/unit.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    CouchDbModule.forRoot({
      url: 'http://localhost:5984',
      username: 'admin',
      userpass: 'password',
      requestDefaults: { jar: true }
    }),
    UnitsModule
  ],
  controllers: [AppController]
})
export class AppModule {}
