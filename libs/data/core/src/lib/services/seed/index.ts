import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../../context';
import { AchievementSeed } from './AchievementSeed';
import {
  Achievement,
  AchievementCategory,
  Checkin,
  CheckinAchievement,
  CheckinUser,
  User
} from '../../schema';
import { Collection, Database } from '@nozbe/watermelondb';
import { partition, sampleSize } from 'lodash';
import * as faker from 'faker';
import { CreateCheckinSeed } from './CreateCheckinSeed';

export type SeedArgs = {
  type: 'ACHIEVEMENTS' | 'CHECKINS';
  units: {
    achievements?: AchievementSeed[];
    categories?: string[];
    checkins?: CreateCheckinSeed[];
  };
};

@autoInjectable()
export class SeedService {
  _checkins: Collection<Checkin>;
  _achievements: Collection<Achievement>;
  _users: Collection<User>;
  _checkinUsers: Collection<CheckinUser>;
  _achievementCategories: Collection<AchievementCategory>;
  _checkinAchievements: Collection<CheckinAchievement>;
  _db: Database;

  constructor(@inject('ActContext') private _context?: ActContext) {
    this._db = this._context.get();
    this._achievements = this._context
      .get()
      .collections.get<Achievement>('achievements');

    this._achievementCategories = this._context
      .get()
      .collections.get<AchievementCategory>('achievement_categories');

    this._checkins = this._context
      .get()
      .collections.get<Checkin>('checkins');

    this._users = this._context.get().collections.get<User>('users');

    this._checkinUsers = this._context
      .get()
      .collections.get<CheckinUser>('checkin_users');

    this._checkinAchievements = this._context
      .get()
      .collections.get<CheckinAchievement>('checkin_achievements');
  }

  seedWithAchievementsJsonFile = async (
    remoteAchievementsJsonFile: string
  ) => {
    const achievementsFromJson = (await fetch(
      remoteAchievementsJsonFile
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .catch(function (e) {
        throw Error(e);
      })) as AchievementSeed[];

    const [categories, achievements] = achievementsFromJson.reduce(
      (acc, achievement) => {
        const [c, a] = acc;
        c.add(achievement.category);
        a.set(achievement.name, achievement);

        return [c, a];
      },
      [new Set<string>(), new Map<string, AchievementSeed>()]
    );

    return this.seed({
      type: 'ACHIEVEMENTS',
      units: {
        achievements: Array.from(achievements.values()),
        categories: Array.from(categories)
      }
    });
  };

  seed = (args: SeedArgs) => {
    const { units, type } = args;
    switch (type) {
      case 'ACHIEVEMENTS':
        return this._seedAchievementCategories(
          units.categories || []
        ).then((categories) =>
          this._seedAchievements(
            units.achievements || [],
            categories || []
          )
        );
      case 'CHECKINS':
        if (!units.checkins) {
          throw Error('units.checkins required');
        }
        return this._seedCheckins(units.checkins.length)
          .then((checkins) =>
            this._seedCheckinUsers(checkins, units.checkins)
          )
          .then((checkins) =>
            this._seedCheckinAchievements(checkins, units.checkins)
          );
    }
  };

  _seedCheckins = async (numberOfCheckins: number) => {
    let newCheckinIds = [];
    return new Promise<Checkin[]>((resolve) => {
      this._db.action(async () => {
        [...new Array(numberOfCheckins)].forEach(async (_, i) => {
          newCheckinIds.push(
            await this._checkins.create((m: Checkin) => {
              m.note = faker.lorem.sentences(4);
            })
          );
          if (i + 1 === numberOfCheckins) {
            resolve(newCheckinIds);
          }
        });
      });
    });
  };

  _seedCheckinUsers = async (
    checkins: Checkin[],
    createCheckinsSeed: CreateCheckinSeed[]
  ) => {
    if (checkins.length !== createCheckinsSeed.length) {
      throw Error(
        'checkins[] and createCheckinsSeed[] must be same length'
      );
    }

    const users = await this._users.query().fetch();

    return this._db
      .action(async () => {
        return this._db.batch(
          ...createCheckinsSeed.flatMap(({ numberOfUsers }, i) => {
            const subsetOfUsers = sampleSize(users, numberOfUsers);

            return subsetOfUsers.map((user) => {
              return this._checkinUsers.prepareCreate(
                (checkinUser) => {
                  checkinUser.userId = user.id;
                  checkinUser.checkinId = checkins[i].id;
                }
              );
            });
          })
        );
      })
      .then(() => checkins);
  };

  _seedCheckinAchievements = async (
    checkins: Checkin[],
    createCheckinsSeed: CreateCheckinSeed[]
  ) => {
    if (checkins.length !== createCheckinsSeed.length) {
      throw Error(
        'checkins[] and createCheckinsSeed[] must be same length'
      );
    }

    const achievements = await this._achievements.query().fetch();

    return this._db
      .action(async () => {
        return this._db.batch(
          ...createCheckinsSeed.flatMap(
            ({ numberOfAchievements }, i) => {
              const subsetOfAchievements = sampleSize(
                achievements,
                numberOfAchievements
              );

              return subsetOfAchievements.map((achievement) => {
                return this._checkinAchievements.prepareCreate(
                  (checkinAchievement) => {
                    checkinAchievement.achievementId = achievement.id;
                    checkinAchievement.checkinId = checkins[i].id;
                    checkinAchievement.count = faker.datatype.number({
                      min: 1,
                      max: 9
                    });
                  }
                );
              });
            }
          )
        );
      })
      .then(() => checkins);
  };

  _seedAchievementCategories = async (
    categories: string[]
  ): Promise<AchievementCategory[]> => {
    const allAchievementCategories = await this._achievementCategories
      .query()
      .fetch();

    const [_, insertAchievementCategories] = partition(
      categories,
      (a) => allAchievementCategories.find((aa) => a === aa.name)
    );
    debugger;

    await this._db.action(() =>
      this._db.batch(
        ...insertAchievementCategories.map((ac) =>
          this._achievementCategories.prepareCreate((r) => {
            r.name = ac;
          })
        )
      )
    );

    return this._achievementCategories.query().fetch();
  };

  _seedAchievements = async (
    achievements: AchievementSeed[],
    categories: AchievementCategory[]
  ) => {
    const allAchievements = await this._achievements.query().fetch();

    const [_, insertAchievements] = partition(achievements, (a) =>
      allAchievements.find((aa) => a.name === aa.name)
    );

    return this._db.action((action) =>
      this._db.batch(
        ...insertAchievements.map((a) =>
          this._achievements.prepareCreate((r) => {
            const category = categories.find(
              (c) => c.name === a.category
            );
            r.description = a.description;
            r.photo = a.photo;
            r.points = a.points;
            r.name = a.name;
            r.category.set(category);
          })
        )
      )
    );
  };
}
