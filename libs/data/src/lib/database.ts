import { appSchema, tableSchema } from '@nozbe/watermelondb';
import {
  date,
  field,
  readonly
} from '@nozbe/watermelondb/decorators';

import { Model } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: 'communities',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'deleted', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),
    tableSchema({
      name: 'deleted',
      columns: [
        { name: 'deleted_id', type: 'string' },
        { name: 'created_at', type: 'number' }
      ]
    })
  ]
});

export class Community extends Model {
  static table = 'communities';
  @field('name') name: string;
  @field('deleted') deleted: boolean;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;
}

export class Deleted extends Model {
  static table = 'deleted';
  @field('deleted_id') deletedId: string;
  @readonly @date('created_at') createdAt;
}
