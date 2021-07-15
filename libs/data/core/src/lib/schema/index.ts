import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { ColumnSchema } from '@nozbe/watermelondb/Schema';
import {
  addColumns,
  createTable,
  schemaMigrations
} from '@nozbe/watermelondb/Schema/migrations';

export * from './deleted';
export * from './event';
export * from './community';
export * from './achievement';
export * from './achievement-category';
export * from './user';
export * from './base-model';

const baseColumns = (schema: ColumnSchema[]): ColumnSchema[] => [
  ...schema,
  { name: 'deleted', type: 'boolean' },
  { name: 'created_at', type: 'number' },
  { name: 'updated_at', type: 'number' }
];

export const schemaAndMigrations = {
  schema: appSchema({
    version: 8,
    tables: [
      tableSchema({
        name: 'users',
        columns: baseColumns([
          { name: 'full_name', type: 'string' },
          { name: 'username', type: 'string' },
          { name: 'keycloak_id', type: 'string' },
          { name: 'bio', type: 'string' },
          { name: 'photo', type: 'string' }
        ])
      }),
      tableSchema({
        name: 'achievements',
        columns: baseColumns([
          { name: 'name', type: 'string' },
          { name: 'points', type: 'number' },
          { name: 'photo', type: 'string', isOptional: true },
          { name: 'category_id', type: 'string', isOptional: true },
          { name: 'description', type: 'string', isOptional: true }
        ])
      }),
      tableSchema({
        name: 'achievement_categories',
        columns: baseColumns([{ name: 'name', type: 'string' }])
      }),
      tableSchema({
        name: 'communities',
        columns: baseColumns([{ name: 'name', type: 'string' }])
      }),
      tableSchema({
        name: 'events',
        columns: baseColumns([
          { name: 'name', type: 'string' },
          { name: 'start_date', type: 'number' },
          { name: 'end_date', type: 'number' }
        ])
      }),
      tableSchema({
        name: 'deleted',
        columns: baseColumns([{ name: 'deleted_id', type: 'string' }])
      }),
      tableSchema({
        name: 'checkins',
        columns: baseColumns([
          { name: 'name', type: 'string' },
          { name: 'photo', type: 'string' },
          { name: 'note', type: 'string' }
        ])
      }),
      tableSchema({
        name: 'checkin_achievements',
        columns: baseColumns([
          { name: 'checkin_id', type: 'string' },
          { name: 'achievement_id', type: 'string' }
        ])
      }),
      tableSchema({
        name: 'checkin_users',
        columns: baseColumns([
          { name: 'checkin_id', type: 'string' },
          { name: 'user_id', type: 'string' }
        ])
      })
    ]
  }),
  migrations: schemaMigrations({
    migrations: [
      {
        toVersion: 2,
        steps: [
          createTable({
            name: 'communities',
            columns: [
              { name: 'name', type: 'string' },
              { name: 'created', type: 'number' }
            ]
          })
        ]
      },
      {
        toVersion: 3,
        steps: [
          createTable({
            name: 'deleted',
            columns: [
              { name: 'deleted_id', type: 'string' },
              { name: 'created', type: 'number' }
            ]
          })
        ]
      },
      {
        toVersion: 4,
        steps: [
          createTable({
            name: 'events',
            columns: [
              { name: 'name', type: 'string' },
              { name: 'start_date', type: 'number' },
              { name: 'end_date', type: 'number' },
              { name: 'deleted', type: 'boolean' },
              { name: 'created_at', type: 'number' },
              { name: 'updated_at', type: 'number' }
            ]
          })
        ]
      },
      {
        toVersion: 5,
        steps: [
          createTable({
            name: 'achievements',
            columns: baseColumns([
              { name: 'name', type: 'string' },
              { name: 'points', type: 'string' },
              { name: 'points', type: 'number' },
              { name: 'photo', type: 'string', isOptional: true },
              { name: 'category_id', type: 'string' }
            ])
          }),
          createTable({
            name: 'achievement_categories',
            columns: baseColumns([{ name: 'name', type: 'string' }])
          })
        ]
      },
      {
        toVersion: 6,
        steps: [
          createTable({
            name: 'users',
            columns: baseColumns([
              { name: 'full_name', type: 'string' },
              { name: 'username', type: 'string' },
              { name: 'keycloak_id', type: 'string' }
            ])
          })
        ]
      },
      {
        toVersion: 7,
        steps: [
          createTable({
            name: 'checkins',
            columns: baseColumns([
              { name: 'name', type: 'string' },
              { name: 'photo', type: 'string' },
              { name: 'note', type: 'string' }
            ])
          }),
          createTable({
            name: 'checkin_achievements',
            columns: baseColumns([
              { name: 'checkin_id', type: 'string' },
              { name: 'achievement_id', type: 'string' }
            ])
          }),
          createTable({
            name: 'checkin_users',
            columns: baseColumns([
              { name: 'checkin_id', type: 'string' },
              { name: 'user_id', type: 'string' }
            ])
          }),
          addColumns({
            table: 'users',
            columns: [
              { name: 'bio', type: 'string' },
              { name: 'photo', type: 'string' }
            ]
          }),
          addColumns({
            table: 'achievements',
            columns: [
              {
                name: 'description',
                type: 'string',
                isOptional: true
              }
            ]
          })
        ]
      },
      {
        toVersion: 8,
        steps: [
          addColumns({
            table: 'checkins',
            columns: [{ name: 'approved', type: 'boolean' }]
          })
        ]
      }
    ]
  })
};
