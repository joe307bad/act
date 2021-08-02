import { Achievement, BaseModel } from '@act/data/core';
import { snakeCase } from 'change-case';
import React, {
  FC,
  memo,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState
} from 'react';
import { FlatList, GestureResponderEvent } from 'react-native';
import { Surface } from 'react-native-paper';
import { SelectedOption } from '.';
import { Option } from './Option';

type OptionListProps<T extends BaseModel> = {
  data: T[];
  onChange?: (
    selected: Map<string, any>,
    itemsCounts?: Map<string, number>
  ) => void;
  initialSelected: Map<string, SelectedOption>;
  optionTitleProperty: keyof T;
  optionSubtitleProperty?: keyof T;
  selectable?: boolean;
  showCountDropdown?: boolean;
};
const OptionListComponent: <T extends BaseModel>(
  p: PropsWithChildren<OptionListProps<T>>
) => ReactElement = ({
  data,
  onChange,
  initialSelected = new Map(),
  optionSubtitleProperty,
  optionTitleProperty,
  selectable = true,
  showCountDropdown = false
}) => {
  const [items, setItems] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    onChange(items);
  }, [items]);

  useEffect(() => {
    setItems(
      new Map(
        Array.from(initialSelected.entries()).map(([id, a]) => [
          a.id,
          {
            id: a.id,
            name: a.display
          } as Achievement
        ])
      )
    );
  }, []);

  const renderItem: FC<{ item: any }> = ({ item }) => {
    const { id, username } = item;
    return (
      <Option
        disableSelection={!selectable}
        key={id}
        value={id}
        title={item[snakeCase(optionTitleProperty as string)]}
        subtitle={item[snakeCase(optionSubtitleProperty as string)]}
        checked={items.has(id)}
        showCountDropdown={showCountDropdown}
        onPress={(e: GestureResponderEvent, count?: number) => {
          const exists = items.has(id);
          const newItems = new Map(items);
          if (exists) {
            newItems.delete(id);
          } else {
            newItems.set(id, { id, name: username });
          }
          setItems(newItems);
        }}
      />
    );
  };
  return (
    <Surface style={{ elevation: 2 }}>
      <FlatList
        data={Array.from(data)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Surface>
  );
};

export const OptionList = memo(OptionListComponent);
