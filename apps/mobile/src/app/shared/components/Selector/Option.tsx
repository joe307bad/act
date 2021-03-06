import { Box, Column, Columns, Row, Rows } from '@mobily/stacks';
import React, { PureComponent } from 'react';
import {
  Checkbox,
  TouchableRipple,
  useTheme
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Chip from '../Chip';
import { GestureResponderEvent, Text } from 'react-native';
import { Dropdown } from '../Dropdown';

export class Option extends PureComponent<{
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
  onCheckButtonPress?: () => void;
  onDeleteButtonPress?: (confirmDelete: any) => void;
  primaryColor?: string;
}> {
  render() {
    const {
      title,
      disableSelection,
      checked = false,
      count,
      showCountDropdown,
      showInfoButton,
      onInfoButtonPress,
      points,
      onPress,
      fixedCount,
      subtitle,
      onCheckButtonPress,
      onDeleteButtonPress,
      primaryColor
    } = this.props;

    return (
      <Box>
        <Columns alignY="center">
          {!disableSelection && (
            <Column width="content">
              <Checkbox.Android
                onPress={() => onPress?.({} as any, null)}
                color={primaryColor}
                status={checked ? 'checked' : 'unchecked'}
              />
            </Column>
          )}
          <Column
            paddingLeft={disableSelection ? 2 : 0}
            paddingRight={disableSelection ? 2 : 0}
          >
            <TouchableRipple onPress={onPress}>
              {subtitle ? (
                <Rows>
                  <Row paddingTop={2}>
                    <Text numberOfLines={1}>{title}</Text>
                  </Row>
                  <Row paddingBottom={2}>
                    <Text style={{ marginTop: -5 }} numberOfLines={1}>
                      {subtitle}
                    </Text>
                  </Row>
                </Rows>
              ) : (
                <Text numberOfLines={1}>{title}</Text>
              )}
            </TouchableRipple>
          </Column>

          {showCountDropdown && (
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
                onValueChange={(itemValue) =>
                  onPress(
                    {} as GestureResponderEvent,
                    Number(itemValue)
                  )
                }
                value={count ? Number(count).toString() : '1'}
              />
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
                <Chip title={points.toLocaleString()} />
              </TouchableRipple>
            </Column>
          )}
          {showInfoButton && (
            <Column width="content" paddingRight={2}>
              <TouchableRipple onPress={onInfoButtonPress}>
                <MaterialCommunityIcons
                  name="information-outline"
                  color={primaryColor}
                  size={30}
                />
              </TouchableRipple>
            </Column>
          )}
          {onDeleteButtonPress && (
            <Column width="content" paddingRight={2}>
              <TouchableRipple onPress={onDeleteButtonPress}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  color={primaryColor}
                  size={30}
                />
              </TouchableRipple>
            </Column>
          )}
          {onCheckButtonPress && (
            <Column width="content" paddingRight={2}>
              <TouchableRipple onPress={onCheckButtonPress}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  color={primaryColor}
                  size={30}
                />
              </TouchableRipple>
            </Column>
          )}
        </Columns>
      </Box>
    );
  }
}
