import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {
  sync,
  schemaAndMigrations,
  databaseFactory,
  useCollectionFactory
} from '@act/data/core';

let adapter: SQLiteAdapter;

const getDatabase = (() => {
  if (!adapter) {
    adapter = new SQLiteAdapter(schemaAndMigrations);
  }

  return databaseFactory(adapter);
})();

export const rn = {
  useCollection: useCollectionFactory(getDatabase()),
  sync: () => sync(getDatabase()),
  getDatabase
};
