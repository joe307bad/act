import { DatabaseAdapter } from '@nozbe/watermelondb/adapters/type';
import Database from '@nozbe/watermelondb/Database';
import { singleton } from 'tsyringe';
import {
  Achievement,
  AchievementCategory,
  Community,
  Deleted,
  Event,
  User
} from './schema';
import { Checkin } from './schema/checkin';
import { CheckinAchievement } from './schema/checkin-achievement';
import { CheckinUser } from './schema/checkin-users';

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
        AchievementCategory,
        User,
        Checkin,
        CheckinAchievement,
        CheckinUser
      ],
      actionsEnabled: true
    });
  }

  get() {
    return this._database;
  }
}
