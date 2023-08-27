import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schemaAndMigrations, registryFactory } from '@act/data/core';

/**
 * │  │ api      │ Test │          │                       │ https://sparkling-pond-7062.fly.dev/                 │                    │
 * │  │ api      │ Prod │          │                       │ https://sparkling-pond-7063.fly.dev/api
 */

export default registryFactory(
  new LokiJSAdapter({
    ...schemaAndMigrations,
    useWebWorker: false,
    useIncrementalIndexedDB: true
  }),
  //@ts-ignore
  {
    ACT_API_URL: 'https://sparkling-pond-7063.fly.dev/api',
    KEYCLOAK_URL: ""
  }
);
