import { DatabaseAdapter } from '@nozbe/watermelondb/adapters/type';
import Database from '@nozbe/watermelondb/Database';
import { Community, Deleted } from './database';
import { sync } from './sync';

export const contextBuilder = (adapter: DatabaseAdapter) => {
  const database = new Database({
    adapter,
    modelClasses: [Community, Deleted],
    actionsEnabled: true
  });

  const communitiesCollection =
    database.collections.get<Community>('communities');

  return {
    database,
    sync: () => sync(database),
    entities: {
      communities: {
        collection: communitiesCollection,
        insert: (onComplete?: () => {}) =>
          database
            .action(() =>
              communitiesCollection.create((community) => {
                community.name = 'New community';
                community.created = Date.now();
              })
            )
            .then(() => {
              typeof onComplete === 'function' && onComplete?.();
            })
      }
    }
  };
};
