import { Achievement, BaseModel } from '@act/data/core';
import React, {
  Component,
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
import { TouchableRipple, useTheme } from 'react-native-paper';
import { Text } from 'react-native';
import { Box, Column, Row, Rows, Stack } from '@mobily/stacks';
import { getDefaultFont } from '../../core/getDefaultFont';
import { Dropdown } from './Dropdown';

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

export class RenderTabbedListOption extends Component<{
  route: any;
  data: any;
}> {
  render() {
    const { name: title } = this.props.data.item;
    return (
      <Box>
        <Column>
          <TouchableRipple onPress={() => {}}>
            <Box padding={2}>
              <Text
                style={{ fontFamily: getDefaultFont() }}
                numberOfLines={1}
              >
                {title}
              </Text>
            </Box>
          </TouchableRipple>
        </Column>
        <Column width="content">
          <Dropdown
            items={[
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
              { label: '4', value: '4' },
              { label: '5', value: '5' },
              { label: '6', value: '6' },
              { label: '7', value: '7' },
              { label: '8', value: '8' },
              { label: '9', value: '9' }
            ]}
            onValueChange={(itemValue) => {}}
            value={'1'}
          />
        </Column>
      </Box>
      // <Option
      //   fixedCount={0}
      //   count={0}
      //   points={234}
      //   disableSelection={true}
      //   checked={false}
      //   title={'wefwef'}
      //   value={'wefwef'}
      //   key={this.props.data.id}
      //   showCountDropdown={true}
      //   showInfoButton={true}
      //   onInfoButtonPress={() => {
      //     //setSelectedInfo(name, description)
      //   }}
      //   onPress={(e, count) => {
      //     // if (onOptionSelect) {
      //     //   onOptionSelect(item);
      //     //   return;
      //     // }
      //     // if (count) {
      //     //   const newCounts = new Map(itemsCounts);
      //     //   newCounts.set(id, count);
      //     //   setItemsCounts(newCounts);
      //     // }
      //     // const exists = items.has(id);
      //     // const newItems = new Map(items);
      //     // if (exists && !count) {
      //     //   newItems.delete(id);
      //     // } else {
      //     //   newItems.set(id, item);
      //     // }
      //     // setItems(newItems);
      //   }}
      // />
    );
  }
}

// export const RenderTabbedListOption: FC<{
//   item: Achievement & { fixedCount: number };
// }> = ({ item }) => {
//   const { id, points, name, description, fixedCount } = item;

//   return (
//     <TabbedListOptionContext.Consumer>
//       {({
//         items,
//         setItems,
//         itemsCounts,
//         setItemsCounts,
//         selectable,
//         showCountDropdown,
//         showInfoButton,
//         setSelectedInfo,
//         hiddenOptions,
//         onOptionSelect
//       }) =>
//         hiddenOptions?.has(id) ? null : (
//           <Option
//             fixedCount={fixedCount}
//             count={itemsCounts.get(id)}
//             points={points}
//             disableSelection={!selectable}
//             checked={items.has(id)}
//             title={name}
//             value={id}
//             key={id}
//             showCountDropdown={showCountDropdown}
//             showInfoButton={showInfoButton}
//             onInfoButtonPress={() =>
//               setSelectedInfo(name, description)
//             }
//             onPress={(e, count) => {
//               if (onOptionSelect) {
//                 onOptionSelect(item);
//                 return;
//               }
//               if (count) {
//                 const newCounts = new Map(itemsCounts);
//                 newCounts.set(id, count);
//                 setItemsCounts(newCounts);
//               }

//               const exists = items.has(id);
//               const newItems = new Map(items);
//               if (exists && !count) {
//                 newItems.delete(id);
//               } else {
//                 newItems.set(id, item);
//               }
//               setItems(newItems);
//             }}
//           />
//         )
//       }
//     </TabbedListOptionContext.Consumer>
//   );
// };

export class AchievementList extends PureComponent<{
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
        renderItem={RenderTabbedListOption}
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
  onOptionSelect,
  data
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
  const [routes, setRoutes] =
    useState<{ key: string; title: string }[]>();

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
      {routes && (
        <TabView
          renderTabBar={(props) => (
            <TB
              {...props}
              scrollEnabled={true}
              indicatorStyle={{ backgroundColor: 'white' }}
              style={{ backgroundColor: colors.primary }}
              labelStyle={{
                fontSize: 20,
                fontFamily: 'Bebas-Regular'
              }}
            />
          )}
          navigationState={{ index, routes }}
          //lazy={true}
          renderScene={({ route }) => (
            <AchievementList route={route} data={data} />
          )}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      )}
    </TabbedListOptionContext.Provider>
  );
};

export const TabbedList = memo(TabbedListComponent);
