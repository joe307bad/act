import React from 'react';
import { contextBuilder, schema } from '@act/data';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
import withObservables from '@nozbe/with-observables';
import { make } from "../../lib/es6/re/Index.bs";

const adapter = new SQLiteAdapter({
    schema,
    migrations: schemaMigrations({ migrations: [] })
})

const {sync, entities} = contextBuilder(adapter);
 
 const appWithPosts = withObservables(['post'], () => ({
     allPosts: entities.posts.collection.query().observe()
 }))
 const AppWithPosts = appWithPosts(make)
 
 export default () => <AppWithPosts insertPost={() => entities.posts.insert(() => sync())} />
 