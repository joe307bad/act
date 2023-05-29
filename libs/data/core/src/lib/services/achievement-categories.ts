import { Database } from '@nozbe/watermelondb';
import Collection from '@nozbe/watermelondb/Collection';
import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { AchievementCategory, Deleted } from '../schema';

@autoInjectable()
export class AchievementCategoriesService {
  _collection: Collection<AchievementCategory>;
  _deletedCollection: Collection<Deleted>;
  _db: Database;

  constructor(@inject('ActContext') private _context?: ActContext) {
    this._db = this._context.get();
    this._collection = this._context
      .get()
      .collections.get<AchievementCategory>('achievement_categories');
    this._deletedCollection = this._context
      .get()
      .collections.get<Deleted>('deleted');
  }

  insert = async () => {
    await this._db.write(
      async () =>
        await this._collection.create((achievementCategory) => {
          achievementCategory.name = 'New AchievementCategory';
        })
    );
  };

  update = async (id, name: string) => {
    await this._db.write(async () => {
      const achievementCategoryToEdit = await this._collection.find(
        id
      );
      await achievementCategoryToEdit.update(
        (achievementCategory) => {
          achievementCategory.name = name;
        }
      );
    });
  };

  delete = async (id) => {
    await this._db.write(async () => {
      const achievementCategoryToDelete = await this._collection.find(
        id
      );
      await this._db.batch(
        this._deletedCollection.prepareCreate((deletedUnit) => {
          deletedUnit.deletedId = id;
        }),
        achievementCategoryToDelete.prepareMarkAsDeleted()
      );
    });
  };
}
