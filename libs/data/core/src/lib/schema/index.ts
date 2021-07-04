import { appSchema, Model, tableSchema } from '@nozbe/watermelondb';
import {
  ColumnSchema,
  TableSchema
} from '@nozbe/watermelondb/Schema';
import {
  createTable,
  schemaMigrations
} from '@nozbe/watermelondb/Schema/migrations';

export * from './deleted';
export * from './event';
export * from './community';
export * from './achievement';
export * from './achievement-category';
export * from './user';

const baseColumns = (schema: ColumnSchema[]): ColumnSchema[] => [
  ...schema,
  { name: 'deleted', type: 'boolean' },
  { name: 'created_at', type: 'number' },
  { name: 'updated_at', type: 'number' }
];

export const schemaAndMigrations = {
  schema: appSchema({
    version: 6,
    tables: [
      tableSchema({
        name: 'users',
        columns: baseColumns([
          { name: 'full_name', type: 'string' },
          { name: 'username', type: 'string' },
          { name: 'keycloak_id', type: 'string' }
        ])
      }),
      tableSchema({
        name: 'achievements',
        columns: baseColumns([
          { name: 'name', type: 'string' },
          { name: 'points', type: 'number' },
          { name: 'photo', type: 'string', isOptional: true },
          { name: 'category_id', type: 'string', isOptional: true }
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
      }
    ]
  })
};
