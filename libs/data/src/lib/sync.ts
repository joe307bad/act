import { synchronize } from '@nozbe/watermelondb/sync'
import { database } from './database';

async function sync() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const urlParams = `last_pulled_at=${lastPulledAt}&schema_version=${schemaVersion}&migration=${encodeURIComponent(JSON.stringify(migration))}`
      const response = await fetch(`http://localhost:3333/api/sync?${urlParams}`)
      if (!response.ok) {
        throw new Error(await response.text())
      }

      const { changes, timestamp } = await response.json()
      return { changes, timestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const response = await fetch(`http://localhost:3333/api/sync?last_pulled_at=${lastPulledAt}`, {
        method: 'POST',
        body: JSON.stringify(changes)
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
    },
    migrationsEnabledAtVersion: 1,
  })
}

export { sync };

