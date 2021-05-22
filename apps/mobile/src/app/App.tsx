import React from 'react';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
import withObservables from '@nozbe/with-observables';
import { make as App } from '../../lib/es6/re/Index.bs';

// const adapter = new SQLiteAdapter({
//   schema,
//   migrations: schemaMigrations({ migrations: [] })
// });

// const { sync, entities } = contextBuilder(adapter);

// const appWithPosts = withObservables(['post'], () => ({
//   allPosts: entities.posts.collection.query().observe()
// }));
// const AppWithPosts = appWithPosts(make);

export default () => <App insertPost={() => {}} />;
