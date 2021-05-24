import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schemaAndMigrations, registryFactory } from '@act/data/core';

export default registryFactory(
  new LokiJSAdapter({
    ...schemaAndMigrations,
    useWebWorker: false,
    useIncrementalIndexedDB: true
  })
);
