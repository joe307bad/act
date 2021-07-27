import { BaseModel } from '@act/data/core';
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState
} from 'react';
import { Option } from './Selector/Option';
import { SelectedOption } from './Selector';
import { useWindowDimensions } from 'react-native';
import { TabView, TabBar as TB } from 'react-native-tab-view';
import { useTheme } from 'react-native-paper';

export type TabbedListProps<T, C> = {
  data: T[];
  categories: C[];
  optionTitleProperty: string;
  optionSubtitleProperty?: string;
  onChange?: (selected: Map<string, SelectedOption>) => void;
  initialSelected?: Map<string, SelectedOption>;
  selectable?: boolean;
  showCountDropdown?: boolean;
  hiddenOptions?: Set<string>;
};
export type Category = { name: string } & BaseModel;

type Item = {
  selected: boolean;
  display: string;
  categoryId: string;
  points?: number;
  count?: number;
};
type ItemMap = Map<string, Item>;

export const TabbedList: <T extends BaseModel, C extends Category>(
  p: PropsWithChildren<TabbedListProps<T, C>>
) => ReactElement = ({
  onChange,
  initialSelected,
  selectable = false,
  data,
  optionTitleProperty,
  categories,
  showCountDropdown = false,
  hiddenOptions
}) => {
  const layout = useWindowDimensions();
  const { colors } = useTheme();
  const [items, setItems] = useState<ItemMap>(
    !initialSelected?.size
      ? new Map()
      : new Map(
          Array.from(initialSelected).map((is) => [
            is[0],
            {
              selected: true,
              display: is[1].display,
              categoryId: is[1].categoryId,
              points: is[1].points,
              count: is[1].count
            }
          ])
        )
  );

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    setRoutes([
      { key: 'all', title: 'All' },
      ...categories.map((c) => ({ key: c.id, title: c.name })),
      { key: 'noCategory', title: 'No Category' }
    ]);
  }, [categories]);

  useEffect(() => {
    setItems(
      new Map(
        data.map((a) => [
          a.id,
          {
            selected: items.get(a.id)?.selected || false,
            display: a[optionTitleProperty],
            categoryId: a.category_id,
            points: a.points,
            count: initialSelected?.get(a.id)?.count || 1
          }
        ])
      )
    );
  }, [data]);

  useEffect(() => {
    if (selectable) {
      onChange(
        new Map(
          Array.from(items)
            .filter((i) => i[1].selected)
            .map((i) => [
              i[0],
              {
                id: i[0],
                display: i[1].display,
                categoryId: i[1].categoryId,
                points: i[1].points,
                count: i[1].count
              }
            ])
        )
      );
    }
  }, [items]);

  return (
    <TabView
      renderTabBar={(props) => (
        <TB
          scrollEnabled={true}
          {...props}
          indicatorStyle={{ backgroundColor: 'white' }}
          style={{
            backgroundColor: colors.primary
          }}
          labelStyle={{
            fontSize: 20,
            fontFamily: 'Bebas-Regular'
          }}
        />
      )}
      navigationState={{ index, routes }}
      renderScene={({ route }) => {
        const conditions = (() => {
          if (route.key === 'noCategory') {
            return (i) => !i[1].categoryId;
          }

          if (route.key === 'all') {
            return () => true;
          }

          return (i) => i[1].categoryId === route.key;
        })();

        return (
          <>
            {Array.from(items)
              .filter(conditions)
              .map((d, i) =>
                hiddenOptions?.has(d[0]) ? null : (
                  <Option
                    onChange={(v, c) => {
                      const newMap = new Map(items);
                      newMap.set(d[0], {
                        ...d[1],
                        selected: v,
                        count: c
                      });
                      setItems(newMap);
                    }}
                    count={
                      items.get(d[0])?.count ||
                      initialSelected.get(d[0])?.count
                    }
                    disableSelection={!selectable}
                    selected={d[1].selected}
                    title={d[1].display}
                    value={d[0]}
                    key={d[0]}
                    showCountDropdown={showCountDropdown}
                  />
                )
              )}
          </>
        );
      }}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};
