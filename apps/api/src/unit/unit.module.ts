import { Module } from '@nestjs/common';
import { CouchDbModule } from 'nest-couchdb';
import { UnitsService } from './unit.service';
import { Unit } from './unit.entity';

@Module({
  imports: [CouchDbModule.forFeature([Unit])],
  providers: [UnitsService],
  exports: [UnitsService],
  controllers: [],
})
export class UnitsModule {}