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
        ...Array.from(achievementCounts).flatMap(([aid, count]) =>
          Array.from({ length: count }, (e, i) =>
            this._checkinAchievementCollection.prepareCreate(
              (m: CheckinAchievement) => {
                m.checkinId = newCheckin.id;
                m.achievementId = aid;
              }
            )
          )
        )
      );
    });
  };
}
