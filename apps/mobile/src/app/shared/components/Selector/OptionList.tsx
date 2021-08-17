import { Achievement, BaseModel } from '@act/data/core';
import { Box } from '@mobily/stacks';
import { snakeCase } from 'change-case';
import React, {
  FC,
  memo,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState
} from 'react';
import { Alert, FlatList, GestureResponderEvent } from 'react-native';
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
  optionSubtitleProperty: keyof T;
  selectable?: boolean;
  showCountDropdown?: boolean;
  onCheckButtonPress?: (id: string) => void;
  onDeleteButtonPress?: (id: string) => void;
  paddingTop?: number;
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
  showCountDropdown = false,
  onCheckButtonPress = undefined,
  onDeleteButtonPress = undefined,
  paddingTop = undefined
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

  const confirmDeletion = (confirmDelete) =>
    Alert.alert(
      'Confirm Checkin Deletion',
      'Are you sure you want to delete this checkin?',
      [{ text: 'Yes', onPress: confirmDelete }, { text: 'No' }]
    );

  const renderItem: FC<{ item: any }> = ({ item }) => {
    const { id } = item;
    return (
      <Box marginBottom={2}>
        <Surface style={{ elevation: 2 }}>
          <Option
            disableSelection={!selectable}
            key={id}
            value={id}
            title={item[snakeCase(optionTitleProperty as string)]}
            subtitle={
              item[snakeCase(optionSubtitleProperty as string)]
            }
            checked={items.has(id)}
            showCountDropdown={showCountDropdown}
            onDeleteButtonPress={
              onDeleteButtonPress
                ? () => confirmDeletion(() => onDeleteButtonPress(id))
                : undefined
            }
            onCheckButtonPress={
              onCheckButtonPress
                ? () => onCheckButtonPress(id)
                : undefined
            }
            onPress={(e: GestureResponderEvent, count?: number) => {
              const exists = items.has(id);
              const newItems = new Map(items);
              if (exists) {
                newItems.delete(id);
              } else {
                newItems.set(id, {
                  id,
                  name: item[
                    snakeCase(optionSubtitleProperty as string)
                  ]
                });
              }
              setItems(newItems);
            }}
          />
        </Surface>
      </Box>
    );
  };
  return (
    <FlatList
      contentContainerStyle={{
        paddingTop: 10,
        paddingBottom: 10
      }}
      data={Array.from(data)}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export const OptionList = memo(OptionListComponent);
