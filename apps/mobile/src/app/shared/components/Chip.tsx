import { Column, Columns } from '@mobily/stacks';
import React from 'react';
import { Chip as C, useTheme } from 'react-native-paper';
import { Text } from 'react-native';

const Chip = ({
  title,
  onDelete = undefined,
  style = undefined,
  count = undefined
}) => {
  const theme = useTheme();
  return (
    <C
      {...(onDelete ? { onClose: onDelete } : {})}
      style={{
        borderWidth: 1,
        margin: 2,
        borderColor: theme.colors.primary,
        ...style
      }}
      textStyle={{
        fontFamily: 'sans-serif',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center'
      }}
      icon="plus-circle"
      mode="outlined"
    >
      <Columns>
        {count && (
          <Column>
            <Text
              style={{
                color: theme.colors.primary,
                paddingRight: 5,
                marginLeft: -5,
                fontWeight: 'bold'
              }}
            >
              {count}
            </Text>
          </Column>
        )}
        <Column>
          <Text>{title}</Text>
        </Column>
      </Columns>
    </C>
  );
};

export default Chip;
