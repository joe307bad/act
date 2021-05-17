import { DatabaseAdapter } from '@nozbe/watermelondb/adapters/type';
import Database from '@nozbe/watermelondb/Database';
import Post from './database';
import { sync } from './sync';

export const contextBuilder = (adapter: DatabaseAdapter) => {
  const database = new Database({
    adapter,
    modelClasses: [Post],
    actionsEnabled: true
  });

  const postsCollection = database.collections.get<Post>('posts');

  return {
    database,
    sync: () => sync(database),
    entities: {
      posts: {
        collection: postsCollection,
        insert: (onComplete?: () => {}) =>
          database
            .action(() =>
              postsCollection.create((post) => {
                post.title = 'New post';
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
