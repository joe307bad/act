import { Module } from '@nestjs/common';
import { CouchDbModule } from 'nest-couchdb';
import { UnitsModule } from '../unit/unit.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CouchDbModule.forRoot({
      url: 'http://localhost:5984',
      username: 'admin',
      userpass: 'password',
      requestDefaults: { jar: true },
    }),
    UnitsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
