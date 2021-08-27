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
import { Surface, useTheme } from 'react-native-paper';
import { SelectedOption } from '.';
import { Option } from './Option';

type OptionListProps<T extends BaseModel> = {
  data: T[];
  onChange?: (items: Map<string, any> | string[]) => void;
  initialSelected: string[];
  optionTitleProperty: keyof T;
  optionSubtitleProperty: keyof T;
  selectable?: boolean;
  showCountDropdown?: boolean;
  onCheckButtonPress?: (id: string) => void;
  onDeleteButtonPress?: (id: string) => void;
  paddingTop?: number;
  defaultSelected: Map<string, any> | string[];
};
const OptionListComponent: <T extends BaseModel>(
  p: PropsWithChildren<OptionListProps<T>>
) => ReactElement = ({
  data,
  onChange,
  defaultSelected,
  optionSubtitleProperty,
  optionTitleProperty,
  selectable = true,
  showCountDropdown = false,
  onCheckButtonPress = undefined,
  onDeleteButtonPress = undefined,
  paddingTop = undefined
}) => {
  const [items, setItems] = useState<Map<string, any> | string[]>(
    defaultSelected || new Map()
  );
  const theme = useTheme();

  useEffect(() => {
    onChange(items);
  }, [items]);

  const confirmDeletion = (confirmDelete) =>
    Alert.alert(
      'Confirm Checkin Deletion',
      'Are you sure you want to delete this checkin?',
      [{ text: 'Yes', onPress: confirmDelete }, { text: 'No' }]
    );

  const renderItem: FC<{ item: any }> = ({ item }) => {
    const isUsersList = Array.isArray(items);
    const id = item.id;
    const checked = isUsersList
      ? new Set(items as string[]).has(item.id)
      : (items as Map<string, any>).has(item.id);
    return (
      <Box marginBottom={2}>
        <Surface style={{ elevation: 2 }}>
          <Option
            primaryColor={theme.colors.primary}
            disableSelection={!selectable}
            key={id}
            value={id}
            title={item[snakeCase(optionTitleProperty as string)]}
            subtitle={
              item[snakeCase(optionSubtitleProperty as string)]
            }
            checked={checked}
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
              if (isUsersList) {
                const selectedUsers = new Set(items as string[]);
                if (selectedUsers.has(id)) {
                  selectedUsers.delete(id);
                } else {
                  selectedUsers.add(id);
                }
                setItems(Array.from(selectedUsers));
              } else {
                const exists = checked;
                const newItems = new Map(items as Map<string, any>);
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
              }
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
