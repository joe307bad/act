import { Achievement } from '@act/data/core';
import React, { FC, PureComponent } from 'react';
import { Box, Columns, Column } from '@mobily/stacks';
import { Text } from 'react-native';
import Chip from '../shared/components/Chip';
import {
  TouchableRipple,
  useTheme,
  withTheme
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { withCommas } from '../core/withCommas';

export class AchievementRowLiteComponent extends PureComponent<{
  item: Achievement;
  onPress: () => void;
  fixedCount?: number;
  theme: Theme;
}> {
  render() {
    const { onPress, item, fixedCount, theme } = this.props;
    const { name, points, enabled } = item;
    return (
      <TouchableRipple onPress={onPress}>
        <Box padding={2} alignX="center">
          <Columns alignY="center">
            <Column width="content" paddingRight={2}>
              {enabled && (
                <MaterialCommunityIcons
                  name="death-star"
                  color={theme.colors.primary}
                  size={20}
                />
              )}
            </Column>
            <Column>
              <Text>{name}</Text>
            </Column>
            {!!fixedCount && (
              <Column width="content">
                <Chip title={fixedCount} icon="multiplication-box" />
              </Column>
            )}
            <Column width="content">
              <Chip title={withCommas(points)} />
            </Column>
          </Columns>
        </Box>
      </TouchableRipple>
    );
  }
}

export const AchievementRowLite = withTheme(
  AchievementRowLiteComponent
);
