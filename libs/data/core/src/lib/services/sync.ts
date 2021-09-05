import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { schemaAndMigrations } from '../schema';
import { synchronize } from '@nozbe/watermelondb/sync';
import { debounce } from 'lodash';

@autoInjectable()
export class SyncService {
  _lastPulledAt: number;
  constructor(@inject('ActContext') private _context?: ActContext) {}

  sync = (apiUrlOverride?: string) => {
    const apiUrl = apiUrlOverride ?? this._context.getActApiUrl();
    return synchronize({
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
          `${apiUrl}/sync?${urlParams}`
        ).catch((e) => Promise.reject());
        if (!response.ok) {
          return Promise.reject();
        }

        const { changes, timestamp } = await response.json();
        this._lastPulledAt = timestamp;
        return { changes, timestamp };
      },
      pushChanges: async ({ changes, lastPulledAt }) =>
        fetch(`${apiUrl}/sync?last_pulled_at=${lastPulledAt}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(changes)
        }).catch((e) => Promise.reject()),
      migrationsEnabledAtVersion: 1
    }).then(() => this._lastPulledAt);
  };
}
