import { Box, Column, Columns } from '@mobily/stacks';
import { Picker } from '@react-native-picker/picker';
import React, { FC, useState } from 'react';
import {
  Checkbox,
  Title,
  TouchableRipple,
  useTheme
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Chip from '../Chip';
import { GestureResponderEvent } from 'react-native';

export const Option: FC<{
  value: string;
  title: string;
  subtitle?: string;
  initialValue?: boolean;
  disableSelection: boolean;
  checked?: boolean;
  showCountDropdown?: boolean;
  count?: number;
  showInfoButton?: boolean;
  onInfoButtonPress?: () => void;
  points?: number;
  onPress?: (e: GestureResponderEvent, count?: number) => void;
  fixedCount?: number;
}> = ({
  title,
  disableSelection,
  checked = false,
  count,
  showCountDropdown,
  showInfoButton,
  onInfoButtonPress,
  points,
  onPress,
  fixedCount
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Columns alignY="center">
        {!disableSelection && (
          <Column width="content">
            <Checkbox
              onPress={() => onPress?.({} as any, null)}
              color={theme.colors.primary}
              status={checked ? 'checked' : 'unchecked'}
            />
          </Column>
        )}
        <Column
          paddingLeft={disableSelection ? 2 : 0}
          paddingRight={disableSelection ? 2 : 0}
        >
          <TouchableRipple onPress={onPress}>
            <Title numberOfLines={1}>{title}</Title>
          </TouchableRipple>
        </Column>
        <Column width="content">
          <Columns alignY="center">
            {showCountDropdown && (
              <Column width="1/5" paddingRight={5}>
                <Picker
                  selectedValue={Number(count).toString()}
                  style={{
                    width: widthPercentageToDP(23)
                  }}
                  onValueChange={(itemValue, _) =>
                    onPress(
                      {} as GestureResponderEvent,
                      Number(itemValue)
                    )
                  }
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
              </Column>
            )}
            {!!fixedCount && (
              <Column width="content">
                <Chip title={fixedCount} icon="multiplication-box" />
              </Column>
            )}
            {!!points && (
              <Column width="content" padding={1}>
                <TouchableRipple onPress={onPress}>
                  <Chip title={points} />
                </TouchableRipple>
              </Column>
            )}
            {showInfoButton && (
              <Column width="content" paddingRight={2}>
                <TouchableRipple onPress={onInfoButtonPress}>
                  <MaterialCommunityIcons
                    name="information-outline"
                    color={theme.colors.primary}
                    size={30}
                  />
                </TouchableRipple>
              </Column>
            )}
          </Columns>
        </Column>
      </Columns>
    </Box>
  );
};
