import { BaseModel } from '@act/data/core';
import React, {
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useState
} from 'react';
import { Option, SelectedOption } from './Selector';
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
};
export type Category = { name: string } & BaseModel;

type Item = {
  selected: boolean;
  display: string;
  categoryId: string;
};
type ItemMap = Map<string, Item>;

const ItemsContext =
  createContext<
    [
      items: ItemMap,
      setItems: React.Dispatch<React.SetStateAction<ItemMap>>
    ]
  >(undefined);
const SelectableContext = createContext(false);

export const TabbedList: <T extends BaseModel, C extends Category>(
  p: PropsWithChildren<TabbedListProps<T, C>>
) => ReactElement = ({
  onChange,
  initialSelected,
  selectable = false,
  data,
  optionTitleProperty,
  categories
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
              categoryId: is[1].categoryId
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
            categoryId: a.category_id
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
                categoryId: i[1].categoryId
              }
            ])
        )
      );
    }
  }, [items]);
  return (
    // TODO combine both providers used here
    <ItemsContext.Provider value={[items, setItems]}>
      <SelectableContext.Provider value={selectable}>
        <TabView
          renderTabBar={(props) => (
            <TabBar {...props} colors={colors} />
          )}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      </SelectableContext.Provider>
    </ItemsContext.Provider>
  );
};

const ItemList = ({ categoryId }) => {
  const selectable = useContext(SelectableContext);
  const [items, setItems] = useContext(ItemsContext);

  const conditions = (() => {
    if (categoryId === 'noCategory') {
      return (i) => !i[1].categoryId;
    }

    if (categoryId === 'all') {
      return () => true;
    }

    return (i) => i[1].categoryId === categoryId;
  })();

  return (
    <>
      {Array.from(items)
        .filter(conditions)
        .map((d, i) => (
          <Option
            onChange={(v) => {
              const newMap = new Map(items);
              newMap.set(d[0], { ...d[1], selected: v });
              setItems(newMap);
            }}
            disableSelection={!selectable}
            selected={d[1].selected}
            title={d[1].display}
            value={d[0]}
            key={d[0]}
          />
        ))}
    </>
  );
};

const renderScene = ({ route, jumpTo }) => (
  <ItemList categoryId={route.key} />
);

const TabBar = (props) => (
  <TB
    scrollEnabled={true}
    {...props}
    indicatorStyle={{ backgroundColor: 'white' }}
    style={{
      backgroundColor: props.colors.primary
    }}
    labelStyle={{
      fontSize: 20,
      fontFamily: 'Bebas-Regular'
    }}
  />
);
