import { Q } from '@nozbe/watermelondb';
import Collection from '@nozbe/watermelondb/Collection';
import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { Checkin } from '../schema/checkin';
import { CheckinAchievement } from '../schema/checkin-achievement';
import { CheckinUser } from '../schema/checkin-user';
import { BaseService } from './base-service';
import { difference } from 'lodash';
import { SyncService } from './sync';

type SelectedItem = {
  id: string;
  name: string;
  count?: number;
  points?: number;
};

export type CreateCheckin = {
  insertProps?: Partial<Omit<Checkin, 'achievements' | 'users'>>;
  achievementCounts?: Map<string, number>;
  users?: string[];
  isAdmin?: boolean;
  points?: number;
  created?: Date;
};

@autoInjectable()
export class CheckinsService extends BaseService<Checkin> {
  _checkinAchievementCollection: Collection<CheckinAchievement>;
  _checkinUserCollection: Collection<CheckinUser>;

  constructor(
    @inject('ActContext') private _context?: ActContext,
    @inject('SyncService') private _sync?: SyncService
  ) {
    super(_context, 'checkins');

    this._checkinAchievementCollection = this._context
      .get()
      .collections.get<CheckinAchievement>('checkin_achievements');

    this._checkinUserCollection = this._context
      .get()
      .collections.get<CheckinUser>('checkin_users');
  }

  edit = async (args: {
    id: string;
    editProps: Partial<Omit<Checkin, 'achievements' | 'users'>>;
    achievementCounts: Map<string, number>;
    users: Map<string, SelectedItem>;
  }) => {
    const { id, editProps, achievementCounts, users } = args;
    const selectedUserIds = Array.from(users.keys());

    // all checkin achievements
    const checkinAchievements =
      await this._checkinAchievementCollection
        .query(Q.where('checkin_id', id))
        .fetch();

    // update checkin achievements
    const updateAchievementCounts = Array.from(
      achievementCounts
    ).reduce((acc, item) => {
      const [aid, count] = item;
      const ca = checkinAchievements.find(
        (ca) => ca.achievementId === aid && ca.count !== count
      );
      if (ca) {
        acc.push(ca);
      }
      return acc;
    }, []);

    // insert checkin achievements
    const insertAchievementCounts = Array.from(
      achievementCounts.keys()
    ).filter(
      (ac) =>
        !checkinAchievements.some((ca) => ca.achievementId === ac)
    );

    // remove achievements
    const removeAchievements = difference(
      checkinAchievements.map((u) => u.achievementId),
      Array.from(achievementCounts.keys())
    ).map((ru) =>
      checkinAchievements.find((u) => u.achievementId === ru)
    );

    // users
    const allUsers = await this._checkinUserCollection
      .query(Q.where('checkin_id', id))
      .fetch();

    // insert users
    const insertUsers = selectedUserIds.filter(
      (u) => !allUsers.some((au) => au.userId === u)
    );

    // remove users
    const removeUsers = difference(
      allUsers.map((u) => u.userId),
      selectedUserIds
    ).map((ru) => allUsers.find((u) => u.userId === ru));

    return this._db.write(async (action) =>
      this._db.batch(
        (await this._collection.find(id)).prepareUpdate(
          (m: Checkin) => {
            for (const property in editProps) {
              m[property] = editProps[property];
            }
          }
        ),
        // achievement counts
        // update achievements counts
        ...updateAchievementCounts.map((uac) =>
          uac.prepareUpdate((m: CheckinAchievement) => {
            m.count = achievementCounts.get(m.achievementId);
          })
        ),
        // insert achievement counts
        ...insertAchievementCounts.map((iac) => {
          return this._checkinAchievementCollection.prepareCreate(
            (m: CheckinAchievement) => {
              m.checkinId = id;
              m.achievementId = iac;
              m.count = achievementCounts.get(iac);
            }
          );
        }),
        // remove achievement counts
        ...removeAchievements.map((ra) => ra.prepareMarkAsDeleted()),
        ...removeAchievements.map((ra) =>
          this._deletedCollection.prepareCreate((deletedUnit) => {
            deletedUnit.deletedId = ra.id;
          })
        ),
        // users
        // insert users
        ...insertUsers.map((uid) =>
          this._checkinUserCollection.prepareCreate(
            (m: CheckinUser) => {
              m.checkinId = id;
              m.userId = uid;
            }
          )
        ),
        // remove users
        ...removeUsers.map((ru) => ru.prepareMarkAsDeleted()),
        ...removeUsers.map((ru) =>
          this._deletedCollection.prepareCreate((deletedUnit) => {
            deletedUnit.deletedId = ru.id;
          })
        )
      )
    );
  };

  find = async (id: string) => this._collection.find(id);

  create = (args: CreateCheckin): Promise<Date> =>
    this._db.write(async (action) => {
      const {
        insertProps,
        achievementCounts,
        users,
        isAdmin = false
      } = args;

      const newCheckin = await this._collection.create(
        (m: Checkin) => {
          if (insertProps) {
            for (const property in insertProps) {
              m[property] = insertProps[property];
            }
          }
          m.approved = isAdmin;
        }
      );

      return this._db
        .batch(
          ...(achievementCounts
            ? Array.from(achievementCounts).map(([aid, count]) =>
                this._checkinAchievementCollection.prepareCreate(
                  (m: CheckinAchievement) => {
                    m.checkinId = newCheckin.id;
                    m.achievementId = aid;
                    m.count = count;
                  }
                )
              )
            : []),
          ...(users
            ? users.map((uid) =>
                this._checkinUserCollection.prepareCreate(
                  (m: CheckinUser) => {
                    m.checkinId = newCheckin.id;
                    m.userId = uid;
                  }
                )
              )
            : [])
        )
        .then(() => newCheckin.createdAt);
    });

  approveCheckins = async (checkins: Set<string>) =>
    this._db.write(async () =>
      this._db.batch(
        ...(await Promise.all(
          Array.from(checkins).map(async (checkinId) =>
            (
              await this._collection.find(checkinId)
            ).prepareUpdate((c) => {
              c.approved = true;
            })
          )
        ))
      )
    );

  approveAllCheckins = async (excludeCheckins: Set<string>) => {
    const allCheckins = await this._collection
      .query(Q.where('approved', false))
      .fetch();
    return this._db.write(async () =>
      this._db.batch(
        ...allCheckins
          .filter((c) => !excludeCheckins.has(c.id))
          .map((c) =>
            c.prepareUpdate((checkin) => {
              checkin.approved = true;
            })
          )
      )
    );
  };
}
