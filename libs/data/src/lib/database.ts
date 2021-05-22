import { Database } from '@nozbe/watermelondb';
import { Community, Deleted } from './schema';

let database: Database;

export const databaseFactory = (adapter) => (): Database => {
  if (!database) {
    database = new Database({
      adapter,
      modelClasses: [Community, Deleted],
      actionsEnabled: true
    });
  }
  return database;
};
