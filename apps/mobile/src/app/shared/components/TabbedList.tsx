import { Achievement, BaseModel } from '@act/data/core';
import React, {
  createContext,
  Dispatch,
  memo,
  PropsWithChildren,
  ReactElement,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { Option } from './Selector/Option';
import { SelectedOption } from './Selector';
import { FlatList } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import { Rows, Row, Box } from '@mobily/stacks';

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
  const [items, setItems] = useState<Map<string, Achievement>>(
    new Map()
  );
  const [itemsByCategory, setItemsByCategory] = useState<
    Map<string, Map<string, Achievement>>
  >(new Map());
  const [itemsCounts, setItemsCounts] = useState<Map<string, number>>(
    new Map()
  );
  const [selectedCategory, setSelectedCategory] = useState(
    categories[0].id
  );
  const theme = useTheme();

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

    setItemsByCategory(
      data.reduce((acc, item: any) => {
        const achievement = item;

        const categoryExists = acc.get(achievement.category_id);

        if (categoryExists) {
          return acc.set(
            achievement.category_id,
            new Map([
              ...categoryExists,
              ...new Map([[achievement.id, achievement]])
            ])
          );
        }

        return acc.set(
          achievement.category_id,
          new Map([[achievement.id, achievement]])
        );
      }, new Map())
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
  console.log({ itemsByCategory, selectedCategory });
  const achievements = itemsByCategory.get(selectedCategory);
  return (
    <Rows>
      <Row height="content">
        <Surface style={{ elevation: 2 }}>
          <Dropdown
            fullWidth
            value={selectedCategory}
            onValueChange={(v) => setSelectedCategory(v)}
            items={categories.map((c) => ({
              label: c.name,
              value: c.id
            }))}
            padding={3}
          />
        </Surface>
      </Row>
      <Row>
        <Box padding={2} paddingBottom={0} paddingTop={0}>
          {achievements && (
            <FlatList
              data={
                hiddenOptions.size === 0
                  ? Array.from(achievements.values())
                  : Array.from(achievements.values()).filter(
                      (a) => !hiddenOptions.has(a.id)
                    )
              }
              renderItem={({ item }) => {
                const { points, id, name, description } =
                  item as Achievement;
                return (
                  <Option
                    primaryColor={theme.colors.primary}
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
                );
              }}
              keyExtractor={(item) => item.id}
            />
          )}
        </Box>
      </Row>
    </Rows>
  );
};

export const TabbedList = memo(TabbedListComponent);
