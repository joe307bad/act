import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schemaAndMigrations, registryFactory } from '@act/data/core';

export default registryFactory(
  new LokiJSAdapter({
    ...schemaAndMigrations,
    useWebWorker: false,
    useIncrementalIndexedDB: true
  }),
  //@ts-ignore
  {
    ACT_API_URL: 'http://localhost:3333/api',
    KEYCLOAK_URL: ""
  }
);
