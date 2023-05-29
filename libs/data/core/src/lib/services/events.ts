import { Database } from '@nozbe/watermelondb';
import Collection from '@nozbe/watermelondb/Collection';
import { inject, autoInjectable } from 'tsyringe';
import { ActContext } from '../context';
import { Event, Deleted } from '../schema';

@autoInjectable()
export class EventsService {
  _collection: Collection<Event>;
  _deletedCollection: Collection<Deleted>;
  _db: Database;

  constructor(@inject('ActContext') private _context?: ActContext) {
    this._db = this._context.get();
    this._collection = this._context
      .get()
      .collections.get<Event>('events');
    this._deletedCollection = this._context
      .get()
      .collections.get<Deleted>('deleted');
  }

  insert = async () => {
    await this._db.write(
      async () =>
        await this._collection.create((event) => {
          event.name = 'New event';
        })
    );
  };

  update = async (id, name) => {
    await this._db.write(async () => {
      const eventToEdit = await this._collection.find(id);
      await eventToEdit.update((event) => {
        event.name = name;
      });
    });
  };

  delete = async (id) => {
    await this._db.write(async () => {
      const eventToDelete = await this._collection.find(id);
      await this._db.batch(
        this._deletedCollection.prepareCreate((deletedUnit) => {
          deletedUnit.deletedId = id;
        }),
        eventToDelete.prepareMarkAsDeleted()
      );
    });
  };
}
