import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../../context';
import { AchievementSeed } from './AchievementSeed';
import { Achievement, AchievementCategory } from '../../schema';
import { Collection, Database } from '@nozbe/watermelondb';
import { partition } from 'lodash';

export type SeedArgs = {
  type: 'ACHIEVEMENTS';
  units: {
    achievements?: AchievementSeed[];
    categories?: string[];
  };
};

@autoInjectable()
export class SeedService {
  _achievements: Collection<Achievement>;
  _achievementCategories: Collection<AchievementCategory>;
  _db: Database;

  constructor(@inject('ActContext') private _context?: ActContext) {
    this._db = this._context.get();
    this._achievements = this._context
      .get()
      .collections.get<Achievement>('achievements');

    this._achievementCategories = this._context
      .get()
      .collections.get<AchievementCategory>('achievement_categories');
  }

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
    }
  };

  _seedAchievementCategories = async (
    categories: string[]
  ): Promise<AchievementCategory[]> => {
    const allAchievementCategories = await this._achievementCategories
      .query()
      .fetch();

    const [
      shoulUpdateAchievementCategories,
      insertAchievementCategories
    ] = partition(categories, (a) =>
      allAchievementCategories.find((aa) => a === aa.name)
    );

    const updateAchievementCategories =
      shoulUpdateAchievementCategories.map((suac) =>
        allAchievementCategories.find((aac) => aac.name === suac)
      );

    await this._db.action((action) =>
      this._db.batch(
        ...insertAchievementCategories.map((ac) =>
          this._achievementCategories.prepareCreate((r) => {
            r.name = ac;
          })
        )
        // No need to update because its only the name
        // and the name should be unique
        // ...updateAchievementCategories.map((uac) =>
        //   uac.prepareUpdate((r) => {
        //     r.name = uac.name;
        //   })
        // )
      )
    );

    return this._achievementCategories.query().fetch();
  };

  _seedAchievements = async (
    achievements: AchievementSeed[],
    categories: AchievementCategory[]
  ) => {
    const allAchievements = await this._achievements.query().fetch();
    const allAchievementCategories = await this._achievementCategories
      .query()
      .fetch();

    const [updateAchievements, insertAchievements] = partition(
      achievements,
      (a) => allAchievements.find((aa) => a.name === aa.name)
    );

    const [updateAchievementCategories, insertAchievementCategories] =
      partition(achievements, (a) =>
        allAchievementCategories.find((aa) => a.name === aa.name)
      );

    return this._db.action((action) =>
      this._db.batch(
        ...insertAchievements.map((a) =>
          this._achievements.prepareCreate((r) => {
            const category = categories.find(
              (c) => c.name === a.categoryName
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
