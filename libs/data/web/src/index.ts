import LokiJSAdapter, {
  LokiAdapterOptions
} from '@nozbe/watermelondb/adapters/lokijs';
import {
  sync,
  schemaAndMigrations,
  databaseFactory,
  useCollectionFactory
} from '@act/data/core';

let adapter: LokiAdapterOptions;

const getDatabase = (() => {
  if (!adapter) {
    adapter = new LokiJSAdapter({
      ...schemaAndMigrations,
      useWebWorker: false,
      useIncrementalIndexedDB: true
    });
  }

  return databaseFactory(adapter);
})();

export const web = {
  useCollection: useCollectionFactory(getDatabase()),
  sync: () => sync(getDatabase()),
  getDatabase
};
