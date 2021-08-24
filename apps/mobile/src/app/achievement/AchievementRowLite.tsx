import { Achievement } from '@act/data/core';
import React, { FC, PureComponent } from 'react';
import { Box, Columns, Column } from '@mobily/stacks';
import { Text } from 'react-native';
import Chip from '../shared/components/Chip';
import { TouchableRipple } from 'react-native-paper';

export class AchievementRowLite extends PureComponent<{
  item: Achievement;
  isHidden: boolean;
  onPress: () => void;
}> {
  render() {
    const { onPress, isHidden, item } = this.props;
    const { name, points } = item;
    if (isHidden) {
      return <Box></Box>;
    }
    return (
      <TouchableRipple onPress={onPress}>
        <Box padding={2} alignX="center">
          <Columns alignY="center">
            <Column>
              <Text>{name}</Text>
            </Column>
            <Column width="content">
              <Chip title={points.toLocaleString()} />
            </Column>
          </Columns>
        </Box>
      </TouchableRipple>
    );
  }
}
