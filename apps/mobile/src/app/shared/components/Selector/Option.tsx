import { Picker } from '@react-native-picker/picker';
import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { Checkbox, List, useTheme } from 'react-native-paper';

export const Option: FC<{
  value: string;
  title: string;
  subtitle?: string;
  onChange?: (v: boolean, c: number) => void;
  initialValue?: boolean;
  disableSelection: boolean;
  selected?: boolean;
  showCountDropdown?: boolean;
  count?: number;
}> = ({
  title,
  subtitle,
  onChange,
  initialValue,
  disableSelection,
  selected,
  count,
  showCountDropdown = false
}) => {
  const [checked, setChecked] = useState(
    typeof selected !== 'undefined' ? selected : initialValue
  );
  const theme = useTheme();
  const [selectedCount, setSelectedCount] = useState(count);

  const isChecked = (() => {
    if (typeof selected !== 'undefined') {
      return selected;
    }

    return checked;
  })();

  const onPress = () => {
    setChecked((p) => !p);
    onChange?.(!isChecked, selectedCount);
  };

  return (
    <List.Item
      onPress={onPress}
      titleStyle={{ fontSize: 20 }}
      descriptionStyle={{ fontFamily: 'sans-serif' }}
      title={title}
      description={subtitle}
      {...(!disableSelection
        ? {
            left: (props) => (
              <View style={{ justifyContent: 'center' }}>
                <Checkbox
                  color={theme.colors.primary}
                  status={isChecked ? 'checked' : 'unchecked'}
                  onPress={onPress}
                />
              </View>
            )
          }
        : {})}
      right={
        showCountDropdown
          ? () => (
              <Picker
                selectedValue={Number(selectedCount).toString()}
                style={{ width: 150 }}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedCount(Number(itemValue));
                  onChange?.(isChecked, Number(itemValue));
                }}
              >
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
                <Picker.Item label="6" value="6" />
                <Picker.Item label="7" value="7" />
                <Picker.Item label="8" value="8" />
                <Picker.Item label="9" value="9" />
              </Picker>
            )
          : undefined
      }
    />
  );
};
