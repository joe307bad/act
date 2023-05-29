import { useState, useEffect } from 'react';
import Database from '@nozbe/watermelondb/Database';

const initialConditions: any[] = [];

export const useCollectionFactory = (database: Database) =>
  function <T>(
    collection: string,
    withColumns?: string[],
    conditions = initialConditions
  ): Array<T> {
    const [items, setItems] = useState<Array<T>>([]);
    useEffect(
      function () {
        const observe = (() => {
          if (withColumns) {
            return database.collections
              .get(collection)
              .query(...conditions)
              .observeWithColumns(withColumns);
          }

          return database.collections
            .get(collection)
            .query(...conditions)
            .observe();
        })();
        const subscription = observe.subscribe((records) => {
          setItems(records.map((i) => i._raw as any));
        });
        return () => subscription.unsubscribe();
      },
      [collection, conditions]
    );

    return items;
  };
