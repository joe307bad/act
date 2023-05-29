import { Database } from '@nozbe/watermelondb';
import Collection from '@nozbe/watermelondb/Collection';
import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { Community, Deleted } from '../schema';

@autoInjectable()
export class CommunitiesService {
  _collection: Collection<Community>;
  _deletedCollection: Collection<Deleted>;
  _db: Database;

  constructor(@inject('ActContext') private _context?: ActContext) {
    this._db = this._context.get();
    this._collection = this._context
      .get()
      .collections.get<Community>('communities');
    this._deletedCollection = this._context
      .get()
      .collections.get<Deleted>('deleted');
  }

  insert = async () => {
    await this._db.write(
      async () =>
        await this._collection.create((community) => {
          community.name = 'New community';
        })
    );
  };

  update = async (id, name) => {
    await this._db.write(async () => {
      const communityToEdit = await this._collection.find(id);
      await communityToEdit.update((community) => {
        community.name = name;
      });
    });
  };

  delete = async (id) => {
    await this._db.write(async () => {
      const communityToDelete = await this._collection.find(id);
      await this._db.batch(
        this._deletedCollection.prepareCreate((deletedUnit) => {
          deletedUnit.deletedId = id;
        }),
        communityToDelete.prepareMarkAsDeleted()
      );
    });
  };
}
