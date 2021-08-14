import { Achievement, BaseModel } from '@act/data/core';
import React, {
  createContext,
  Dispatch,
  FC,
  memo,
  PropsWithChildren,
  PureComponent,
  ReactElement,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { Option } from './Selector/Option';
import { SelectedOption } from './Selector';
import { useWindowDimensions, FlatList } from 'react-native';
import { TabView, TabBar as TB } from 'react-native-tab-view';
import { useTheme } from 'react-native-paper';
import db from '@act/data/rn';

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
  value?: any;
  onOptionSelect?: (achievement: Achievement) => void;
};
export type Category = { name: string } & BaseModel;

type TTabbedListOptionContext = {
  items: Map<string, Achievement>;
  setItems: Dispatch<SetStateAction<Map<string, Achievement>>>;
  itemsCounts: Map<string, number>;
  setItemsCounts: Dispatch<SetStateAction<Map<string, number>>>;
  selectable: boolean;
  showCountDropdown: boolean;
  showInfoButton: boolean;
  setSelectedInfo: (title: string, description: string) => void;
  hiddenOptions: Set<string>;
  onOptionSelect: (achievement: Achievement) => void;
};
const TabbedListOptionContext =
  createContext<TTabbedListOptionContext>({
    items: new Map(),
    setItems: () => {},
    itemsCounts: new Map(),
    setItemsCounts: () => {},
    selectable: false,
    showCountDropdown: false,
    showInfoButton: false,
    setSelectedInfo: (title: string, description: string) => {},
    hiddenOptions: new Set(),
    onOptionSelect: (achievement: Achievement) => {}
  });

const RenderItem: FC<{ item: Achievement }> = ({ item }) => {
  const { id, points, name, description } = item;
  return (
    <TabbedListOptionContext.Consumer>
      {({
        items,
        setItems,
        itemsCounts,
        setItemsCounts,
        selectable,
        showCountDropdown,
        showInfoButton,
        setSelectedInfo,
        hiddenOptions,
        onOptionSelect
      }) =>
        hiddenOptions?.has(id) ? null : (
          <Option
            count={itemsCounts.get(id)}
            points={points}
            disableSelection={!selectable}
            checked={items.has(id)}
            title={name}
            value={id}
            key={id}
            showCountDropdown={showCountDropdown}
            showInfoButton={showInfoButton}
            onInfoButtonPress={() =>
              setSelectedInfo(name, description)
            }
            onPress={(e, count) => {
              if (onOptionSelect) {
                onOptionSelect(item);
                return;
              }
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
          />
        )
      }
    </TabbedListOptionContext.Consumer>
  );
};

class AchievementList extends PureComponent<{
  route: any;
  data: any;
}> {
  render() {
    const { route, data } = this.props;
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
        renderItem={RenderItem}
        keyExtractor={(item) => item.id}
      />
    );
  }
}

export const TabbedListComponent: <
  T extends BaseModel,
  C extends Category
>(
  p: PropsWithChildren<TabbedListProps<T, C>>
) => ReactElement = ({
  onChange,
  initialSelected = new Map(),
  selectable = false,
  categories,
  showCountDropdown = false,
  hiddenOptions,
  showInfoButton,
  setSelectedInfo,
  onOptionSelect
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

  const data = db.useCollection<Achievement>('achievements', [
    'name',
    'category_id'
  ]);

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

  return (
    <TabbedListOptionContext.Provider
      value={{
        items,
        setItems,
        itemsCounts,
        setItemsCounts,
        selectable,
        setSelectedInfo,
        showCountDropdown,
        showInfoButton,
        hiddenOptions,
        onOptionSelect
      }}
    >
      <TabView
        renderTabBar={(props) => (
          <TB
            {...props}
            scrollEnabled={true}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: colors.primary }}
            labelStyle={{ fontSize: 20, fontFamily: 'Bebas-Regular' }}
          />
        )}
        navigationState={{ index, routes }}
        lazy={true}
        renderScene={({ route }) => (
          <AchievementList
            onOptionSelect={onOptionSelect}
            route={route}
            data={data}
          />
        )}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </TabbedListOptionContext.Provider>
  );
};

export const TabbedList = memo(TabbedListComponent);
