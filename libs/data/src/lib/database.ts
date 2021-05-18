import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

import { Model } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'communities',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'created', type: 'number' }
      ]
    })
  ]
});

export class Community extends Model {
  static table = 'communities';
  @field('community') name: string;
  @field('created') created: number;
}
