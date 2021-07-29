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
import { Pressable } from 'react-native';
import Chip from '../Chip';

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
  showInfoButton?: boolean;
  onInfoButtonPress?: () => void;
  points?: number;
}> = ({
  title,
  onChange,
  initialValue,
  disableSelection,
  selected,
  count,
  showCountDropdown,
  showInfoButton,
  onInfoButtonPress,
  points
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
    <Box>
      <Columns alignY="center">
        {!disableSelection && (
          <Column width="content">
            <Checkbox
              color={theme.colors.primary}
              status={isChecked ? 'checked' : 'unchecked'}
              onPress={onPress}
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
                  selectedValue={Number(selectedCount).toString()}
                  style={{
                    width: widthPercentageToDP(23)
                  }}
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
    // <List.Item
    //   onPress={onPress}
    //   titleStyle={{ fontSize: 20 }}
    //   descriptionStyle={{ fontFamily: 'sans-serif' }}
    //   title={title}
    //   description={subtitle}
    //   {...(!disableSelection
    //     ? {
    //         left: (props) => (
    //           <View style={{ justifyContent: 'center' }}>
    //             <Checkbox
    //               color={theme.colors.primary}
    //               status={isChecked ? 'checked' : 'unchecked'}
    //               onPress={onPress}
    //             />
    //           </View>
    //         )
    //       }
    //     : {})}
    //   right={
    //     showCountDropdown
    //       ? () => (
    // <Picker
    //   selectedValue={Number(selectedCount).toString()}
    //   style={{ width: 150 }}
    //   onValueChange={(itemValue, itemIndex) => {
    //     setSelectedCount(Number(itemValue));
    //     onChange?.(isChecked, Number(itemValue));
    //   }}
    // >
    //   <Picker.Item label="1" value="1" />
    //   <Picker.Item label="2" value="2" />
    //   <Picker.Item label="3" value="3" />
    //   <Picker.Item label="4" value="4" />
    //   <Picker.Item label="5" value="5" />
    //   <Picker.Item label="6" value="6" />
    //   <Picker.Item label="7" value="7" />
    //   <Picker.Item label="8" value="8" />
    //   <Picker.Item label="9" value="9" />
    // </Picker>
    //         )
    //       : undefined
    //   }
    // />
  );
};
