import { useState, useEffect } from 'react';
import { Condition } from '@nozbe/watermelondb/QueryDescription';
import Database from '@nozbe/watermelondb/Database';

const initialConditions: Array<Condition> = [];

export const useCollectionFactory = (database: Database) =>
  function <T>(
    collection: string,
    conditions = initialConditions
  ): Array<T> {
    const [items, setItems] = useState<Array<T>>([]);
    useEffect(
      function () {
        const subscription = database.collections
          .get(collection)
          .query(...conditions)
          .observe()
          .subscribe((records) => {
            setItems(records.map((i) => i._raw as any));
          });
        return () => subscription.unsubscribe();
      },
      [collection, conditions]
    );

    return items;
  };
