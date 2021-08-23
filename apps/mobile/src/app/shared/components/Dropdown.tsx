import React, { useRef } from 'react';
import { TouchableRipple, useTheme } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Column, Columns } from '@mobily/stacks';
import { Platform } from 'react-native';

export const Dropdown = ({
  onValueChange,
  value,
  items,
  padding = undefined,
  fullWidth = false
}) => {
  const theme = useTheme();
  let pickerRef = React.createRef();

  const openPicker = () => {
    if (Platform.OS === 'android') {
      pickerRef.current.focus();
    } else {
      pickerRef.current.togglePicker(true);
    }
  };

  return (
    <TouchableRipple onPress={() => openPicker()}>
      <Columns alignY="center" padding={padding || 1}>
        <Column width={fullWidth ? undefined : 'content'}>
          <RNPickerSelect
            onValueChange={(itemValue, _) => onValueChange(itemValue)}
            textInputProps={{
              style: {
                color: 'black',
                padding: 0
              }
            }}
            ref={Platform.OS === 'ios' ? pickerRef : null}
            pickerProps={{
              ref: Platform.OS === 'android' ? pickerRef : null
            }}
            style={{
              chevronUp: {
                display: 'none'
              },
              chevronDown: {
                display: 'none'
              },
              iconContainer: {
                display: 'none'
              }
            }}
            useNativeAndroidPickerStyle={true}
            value={value}
            placeholder={{}}
            items={items}
          />
        </Column>
        <Column width="content">
          <MaterialCommunityIcons
            name="chevron-down"
            color={theme.colors.primary}
            size={18}
          />
        </Column>
      </Columns>
    </TouchableRipple>
  );
};
