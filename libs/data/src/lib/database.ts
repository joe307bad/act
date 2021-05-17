import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

import { Model } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'posts',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'subtitle', type: 'string', isOptional: true },
        { name: 'body', type: 'string' },
        { name: 'is_pinned', type: 'boolean' },
        { name: 'created', type: 'number' }
      ]
    }),
    tableSchema({
      name: 'comments',
      columns: [
        { name: 'body', type: 'string' },
        { name: 'post_id', type: 'string', isIndexed: true }
      ]
    })
  ]
});

export default class Post extends Model {
  static table = 'posts';
  @field('title') title: string;
  @field('created') created: number;
}
