import { Entity, CouchDbEntity } from 'nest-couchdb';

@Entity('act')
export class Unit extends CouchDbEntity {
  type: 'achievement' | 'checkin';
}