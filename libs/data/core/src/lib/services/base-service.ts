import { Database, Model } from '@nozbe/watermelondb';
import Collection from '@nozbe/watermelondb/Collection';
import { ActContext } from '../context';
import { Deleted } from '../schema';

export abstract class BaseService<T extends Model> {
  _collection: Collection<T>;
  _deletedCollection: Collection<Deleted>;
  _db: Database;

  constructor(
    private _actContext?: ActContext,
    private _collectionName?: string
  ) {
    this._db = this._actContext.get();
    this._collection = this._actContext
      .get()
      .collections.get<T>(this._collectionName);
    this._deletedCollection = this._actContext
      .get()
      .collections.get<Deleted>('deleted');
  }

  insert = async (name: string) => {
    await this._db.action(
      async () =>
        await this._collection.create((m: any) => {
          m.name = name;
        })
    );
  };

  update = async (id, name) => {
    await this._db.action(async () => {
      const model = await this._collection.find(id);
      await model.update((m: any) => {
        m.name = name;
      });
    });
  };

  delete = async (id) => {
    await this._db.action(async () => {
      const model = await this._collection.find(id);
      await this._db.batch(
        this._deletedCollection.prepareCreate((deletedUnit) => {
          deletedUnit.deletedId = id;
        }),
        model.prepareMarkAsDeleted()
      );
    });
  };
}
