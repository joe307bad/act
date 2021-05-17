import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { contextBuilder, schema } from '@act/data';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
import withObservables from '@nozbe/with-observables';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';

const adapter = new LokiJSAdapter({
  schema,
  migrations: schemaMigrations({ migrations: [] }),
  useWebWorker: false,
  useIncrementalIndexedDB: true
});

const { sync, entities, database } = contextBuilder(adapter);

const appWithPosts = withObservables(['post'], () => ({
  allPosts: entities.posts.collection.query().observe()
}));
const AppWithPosts = appWithPosts(App);

ReactDOM.render(
  <DatabaseProvider database={database}>
    <App />
  </DatabaseProvider>,
  document.getElementById('app')
);

// ReactDOM.render(
//   <AppWithPosts
//     sync={sync}
//     insertPost={() => entities.posts.insert()}
//   />,
//   document.getElementById('app')
// );
