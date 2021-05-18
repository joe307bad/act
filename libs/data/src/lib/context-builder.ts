import { DatabaseAdapter } from '@nozbe/watermelondb/adapters/type';
import Database from '@nozbe/watermelondb/Database';
import { Community } from './database';
import { sync } from './sync';

export const contextBuilder = (adapter: DatabaseAdapter) => {
  const database = new Database({
    adapter,
    modelClasses: [Community],
    actionsEnabled: true
  });

  const communitiesCollection =
    database.collections.get<Community>('posts');

  return {
    database,
    sync: () => sync(database),
    entities: {
      communities: {
        collection: communitiesCollection,
        insert: (onComplete?: () => {}) =>
          database
            .action(() =>
              communitiesCollection.create((post) => {
                post.name = 'New community';
                post.created = Date.now();
              })
            )
            .then(() => {
              typeof onComplete === 'function' && onComplete?.();
            })
      }
    }
  };
};
