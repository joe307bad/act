import { Achievement, BaseModel } from '@act/data/core';
import React, {
  FC,
  memo,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState
} from 'react';
import { Option } from './Selector/Option';
import { SelectedOption } from './Selector';
import {
  useWindowDimensions,
  FlatList,
  GestureResponderEvent
} from 'react-native';
import { TabView, TabBar as TB } from 'react-native-tab-view';
import { useTheme } from 'react-native-paper';

export type TabbedListProps<T, C> = {
  data: T[];
  categories: C[];
  optionTitleProperty: string;
  optionSubtitleProperty?: string;
  onChange?: (
    selected: Map<string, Achievement>,
    itemsCounts: Map<string, number>
  ) => void;
  initialSelected?: Map<string, SelectedOption>;
  selectable?: boolean;
  showCountDropdown?: boolean;
  hiddenOptions?: Set<string>;
  showInfoButton?: boolean;
  setSelectedInfo?: (title: string, description: string) => void;
};
export type Category = { name: string } & BaseModel;

export const TabbedListComponent: <
  T extends BaseModel,
  C extends Category
>(
  p: PropsWithChildren<TabbedListProps<T, C>>
) => ReactElement = ({
  onChange,
  initialSelected = new Map(),
  selectable = false,
  data,
  categories,
  showCountDropdown = false,
  hiddenOptions,
  showInfoButton,
  setSelectedInfo
}) => {
  const layout = useWindowDimensions();
  const { colors } = useTheme();
  const [items, setItems] = useState<Map<string, Achievement>>(
    new Map()
  );
  const [itemsCounts, setItemsCounts] = useState<Map<string, number>>(
    new Map()
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
        Array.from(initialSelected.entries()).map(([id, a]) => [
          a.id,
          {
            id: a.id,
            points: a.points,
            name: a.display
          } as Achievement
        ])
      )
    );

    setItemsCounts(
      new Map(
        Array.from(initialSelected.entries()).map(([id, a]) => [
          a.id,
          a.count
        ])
      )
    );
  }, []);

  useEffect(() => {
    if (selectable) {
      onChange(items, itemsCounts);
    }
  }, [items]);

  const renderItem: FC<{ item: Achievement }> = ({ item }) => {
    const { id, points, name, description } = item;
    return hiddenOptions?.has(id) ? null : (
      <Option
        onPress={(e: GestureResponderEvent, count?: number) => {
          if (count) {
            const newCounts = new Map(itemsCounts);
            newCounts.set(id, count);
            setItemsCounts(newCounts);
          }

          const exists = items.has(id);
          const newItems = new Map(items);
          if (exists && !count) {
            newItems.delete(id);
          } else {
            newItems.set(id, item);
          }
          setItems(newItems);
        }}
        count={itemsCounts.get(id)}
        points={points}
        disableSelection={!selectable}
        checked={items.has(id)}
        title={name}
        value={id}
        key={id}
        showCountDropdown={showCountDropdown}
        showInfoButton={showInfoButton}
        onInfoButtonPress={() => setSelectedInfo(name, description)}
      />
    );
  };

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
      lazy={true}
      renderScene={({ route }) => {
        const conditions = (() => {
          if (route.key === 'noCategory') {
            return (i) => !i.category_id;
          }

          if (route.key === 'all') {
            return () => true;
          }

          return (i) => i.category_id === route.key;
        })();

        return (
          <FlatList
            data={Array.from(data).filter(conditions)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        );
      }}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};

export const TabbedList = memo(TabbedListComponent);
