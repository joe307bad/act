import { DatabaseAdapter } from '@nozbe/watermelondb/adapters/type';
import Database from '@nozbe/watermelondb/Database';
import { singleton } from 'tsyringe';
import {
  Achievement,
  AchievementCategory,
  Community,
  Deleted,
  Event
} from './schema';

@singleton()
export class ActContext {
  private _database: Database;
  constructor(adapter: DatabaseAdapter) {
    this._database = new Database({
      adapter,
      modelClasses: [
        Community,
        Deleted,
        Event,
        Achievement,
        AchievementCategory
      ],
      actionsEnabled: true
    });
  }

  get() {
    return this._database;
  }
}
