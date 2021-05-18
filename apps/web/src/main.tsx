import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { contextBuilder, schema } from '@act/data';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import {
  schemaMigrations,
  createTable
} from '@nozbe/watermelondb/Schema/migrations';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';

const adapter = new LokiJSAdapter({
  schema,
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
      }
    ]
  }),
  useWebWorker: false,
  useIncrementalIndexedDB: true
});

const { database } = contextBuilder(adapter);

ReactDOM.render(
  <DatabaseProvider database={database}>
    <App />
  </DatabaseProvider>,
  document.getElementById('app')
);
