import Collection from '@nozbe/watermelondb/Collection';
import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { Checkin } from '../schema/checkin';
import { CheckinAchievement } from '../schema/checkin-achievement';
import { CheckinUser } from '../schema/checkin-user';
import { BaseService } from './base-service';

@autoInjectable()
export class CheckinsService extends BaseService<Checkin> {
  _checkinAchievementCollection: Collection<CheckinAchievement>;
  _checkinUserCollection: Collection<CheckinUser>;

  constructor(@inject('ActContext') private _context?: ActContext) {
    super(_context, 'checkins');

    this._checkinAchievementCollection = this._context
      .get()
      .collections.get<CheckinAchievement>('checkin_achievements');

    this._checkinUserCollection = this._context
      .get()
      .collections.get<CheckinUser>('checkin_users');
  }

  insertCheckinWithAchievements = async (): Promise<Checkin> => {
    return await this._db.action(async (action) => {
      const newCheckin = await this._collection.create();
      await this._checkinAchievementCollection.create(
        (m: CheckinAchievement) => {
          m.checkinId = newCheckin.id;
          m.achievementId = '3tbpqxlt3dupjcor';
        }
      );
    });
  };

  edit = async (
    id: string,
    editProps: Partial<Omit<Checkin, 'achievements' | 'users'>>,
    achievementCounts: Map<string, number>,
    removedAchievements: Set<string>,
    users: string[],
    removedUsers: Set<string>
  ) => {
    console.log({
      id,
      editProps,
      achievementCounts,
      removedAchievements,
      users,
      removedUsers
    });
    debugger;
    return await this._db.action(async (action) => {
      // batch everything
      //   - update checkin with editProps
      //   - loop through achievementCounts, check if exists, update with new count if it exists, insert if does not exist
      //   - loop through removedAchievements and remove
      //   - loop through users, check if exists, if exists do nothing, if it does not exist, insert
      //   - loop through removed users and remove
    });
  };

  find = async (id: string) => this._collection.find(id);

  create = async (
    insertProps: Partial<Omit<Checkin, 'achievements' | 'users'>>,
    achievementCounts: Map<string, number>,
    users: string[]
  ) => {
    return await this._db.action(async (action) => {
      const newCheckin = await this._collection.create((m: any) => {
        for (const property in insertProps) {
          m[property] = insertProps[property];
        }
      });

      return this._db.batch(
        ...Array.from(achievementCounts).map(([aid, count]) =>
          this._checkinAchievementCollection.prepareCreate(
            (m: CheckinAchievement) => {
              m.checkinId = newCheckin.id;
              m.achievementId = aid;
              m.count = count;
            }
          )
        ),
        ...users.map((uid) =>
          this._checkinUserCollection.prepareCreate(
            (m: CheckinUser) => {
              m.checkinId = newCheckin.id;
              m.userId = uid;
            }
          )
        )
      );
    });
  };
}
