import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { schemaAndMigrations } from '../schema';
import { synchronize } from '@nozbe/watermelondb/sync';
import { debounce } from 'lodash';

@autoInjectable()
export class SyncService {
  constructor(@inject('ActContext') private _context?: ActContext) {}

  sync = () =>
    synchronize({
      database: this._context.get(),
      pullChanges: async ({
        lastPulledAt,
        schemaVersion,
        migration
      }) => {
        const urlParams = `last_pulled_at=${lastPulledAt}&schema_version=${schemaVersion}&migration=${encodeURIComponent(
          JSON.stringify(migration)
        )}&tables=${JSON.stringify(
          Object.keys(schemaAndMigrations.schema.tables)
        )}`;

        const response = await fetch(
          `${this._context.getActApiUrl()}/sync?${urlParams}`
        ).catch((e) => {
          return Promise.reject();
        });
        if (!response.ok) {
          return Promise.reject();
        }

        const { changes, timestamp } = await response.json();
        return { changes, timestamp };
      },
      pushChanges: async ({ changes, lastPulledAt }) =>
        fetch(
          `${this._context.getActApiUrl()}/sync?last_pulled_at=${lastPulledAt}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(changes)
          }
        ).catch((e) => {
          return Promise.reject();
        }),
      migrationsEnabledAtVersion: 1
    });
}
