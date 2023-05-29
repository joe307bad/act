import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { schemaAndMigrations } from '../schema';
import {
  synchronize,
  SyncRejectedIds
} from '@nozbe/watermelondb/sync';

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
        ).catch((e) => Promise.reject(e));
        if (!response.ok) {
          return Promise.reject(new Error('!response.ok'));
        }

        const { changes, timestamp } = await response.json();
        this._lastPulledAt = timestamp;
        return { changes, timestamp };
      },
      pushChanges: async ({ changes, lastPulledAt }) => {
        await fetch(`${apiUrl}/sync?last_pulled_at=${lastPulledAt}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(changes)
        }).catch((e) => Promise.reject(e));
      },
      migrationsEnabledAtVersion: 1
    }).then(() => this._lastPulledAt);
  };
}
