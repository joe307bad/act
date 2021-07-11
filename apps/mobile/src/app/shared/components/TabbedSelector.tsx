import { Achievement, BaseModel } from '@act/data/core';
import { snakeCase } from 'change-case';
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState
} from 'react';
import { Tabs, TabScreen } from 'react-native-paper-tabs';
import { Option, SelectedOption } from './Selector';
import { View, useWindowDimensions } from 'react-native';
import {
  TabView,
  SceneMap,
  TabBar as TB
} from 'react-native-tab-view';
import { useTheme } from 'react-native-paper';
import db from '@act/data/rn';

export type TabbedSelectorProps<T, C> = {
  data: [string, T[]][];
  categories: C[];
  optionTitleProperty: string;
  optionSubtitleProperty?: string;
  onChange?: (selected: Map<string, SelectedOption>) => void;
  initialSelected?: Map<string, SelectedOption>;
  selectable?: boolean;
};

export type Category = { name: string } & BaseModel;
export const TabbedSelector: <
  T extends BaseModel,
  C extends Category
>(
  p: PropsWithChildren<TabbedSelectorProps<T, C>>
) => ReactElement = ({
  onChange,
  initialSelected,
  selectable = false
}) => {
  const [selected, setSelected] =
    useState<Map<string, SelectedOption>>(initialSelected);

  useEffect(() => {
    selectable && onChange(selected);
  }, [selected]);
  return (
    <TabViewExample selectable={selectable} />
    // <Tabs>
    //   {data.map((category) => {
    //     const label = (() => {
    //       if (category[0] === 'null') {
    //         return 'No Category';
    //       }

    //       if (category[0] === 'All') {
    //         return 'All';
    //       }

    //       return categories.find((c) => c.id === category[0]).name;
    //     })();
    //     return (
    //       <TabScreen key={category[0]} label={label}>
    //         <>
    //           {category[1].map((d) => (
    // <Option
    //   initialValue={
    //     selectable ? initialSelected.has(d.id) : false
    //   }
    //   disableSelection={!selectable}
    //   onChange={(v) =>
    //     setSelected((p) => {
    //       const newSelected = new Map(p);
    //       const exists = newSelected.has(d.id);
    //       if (exists) {
    //         newSelected.delete(d.id);
    //         return newSelected;
    //       }
    //       newSelected.set(d.id, {
    //         id: d.id,
    //         display:
    //           d[snakeCase(optionTitleProperty as string)]
    //       });
    //       return newSelected;
    //     })
    //   }
    //   title={d[optionTitleProperty]}
    //   value={d.id}
    //   key={d.id}
    // />
    //           ))}
    //         </>
    //       </TabScreen>
    //     );
    //   })}
    // </Tabs>
  );
};

const All = () => {
  const selectable = React.useContext(SelectableContext);
  const achievements = db.useCollection<Achievement>('achievements', [
    'name'
  ]);
  return (
    <>
      {achievements.map((d, i) => (
        <Option
          disableSelection={!selectable}
          title={d.name}
          value={d.id}
          key={d.id}
        />
      ))}
    </>
  );
};

const NoCategory = () => {
  const selectable = React.useContext(SelectableContext);
  const achievements = db
    .useCollection<Achievement>('achievements', [
      'name',
      'category_id'
    ])
    .filter((a) => !a.category_id);
  return (
    <>
      {achievements.map((d, i) => (
        <Option
          disableSelection={!selectable}
          title={d.name}
          value={d.id}
          key={d.id}
        />
      ))}
    </>
  );
};

const renderScene = SceneMap({
  all: All,
  noCategory: NoCategory
});

const TabBar = (props) => (
  <TB
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

const SelectableContext = React.createContext(false);

function TabViewExample({ selectable }) {
  const layout = useWindowDimensions();
  const { colors } = useTheme();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'all', title: 'All' },
    { key: 'noCategory', title: 'No Category' }
  ]);

  return (
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
  );
}
