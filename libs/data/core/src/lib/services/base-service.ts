import { Database, Model } from '@nozbe/watermelondb';
import Collection from '@nozbe/watermelondb/Collection';
import { ActContext } from '../context';
import { Deleted } from '../schema';
import { camelCase } from 'change-case';

export class BaseService<T extends Model> {
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

  async insert(name: string) {
    await this._db.action(
      async () =>
        await this._collection.create((m: any) => {
          m.name = name;
        })
    );
  }

  insertWithProps = async (insertProps: {
    [key: string]: string | boolean;
  }): Promise<T> => {
    return await this._db.action(
      async () =>
        await this._collection.create((m: any) => {
          for (const property in insertProps) {
            m[property] = insertProps[property];
          }
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

  deleteAll = () =>
    this._db.action(async () => {
      const all = await this._collection.query().fetch();
      await this._db.batch(
        ...all.map((a) =>
          this._deletedCollection.prepareCreate((deletedUnit) => {
            deletedUnit.deletedId = a.id;
          })
        ),
        ...all.map((a) => a.prepareMarkAsDeleted())
      );
    });

  updateWithProps = async (
    id,
    updateProps: { [key: string]: string | boolean }
  ) => {
    await this._db.action(async () => {
      const model = await this._collection.find(id);
      await model.update((m) => {
        for (const property in updateProps) {
          m[camelCase(property)] = updateProps[property];
        }
      });
    });
  };

  updateRelation = async (id, relationName, relationId) => {
    await this._db.action(async () => {
      const model = await this._collection.find(id);
      await model.update((m) => {
        m[relationName].id = relationId;
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

  find = async (id): Promise<T> =>
    this._collection.find(id).catch((e) => e);
}
