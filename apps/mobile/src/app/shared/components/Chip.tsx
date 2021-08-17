import React from 'react';
import { Chip as C, useTheme } from 'react-native-paper';
import { getDefaultFont } from '../../core/getDefaultFont';

const Chip = ({
  title,
  onDelete = undefined,
  style = undefined,
  icon = 'plus-circle'
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
        fontFamily: getDefaultFont(),
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center'
      }}
      icon={icon}
      mode="outlined"
    >
      {title?.toString()}
    </C>
  );
};

export default Chip;
