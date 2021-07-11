import React from 'react';
import ReallyAwesomeButton from 'react-native-really-awesome-button';
import { Headline, useTheme } from 'react-native-paper';
import { color } from 'react-native-reanimated';

const AwesomeButton = ({ children, onPress }) => {
  const { colors } = useTheme();
  return (
    <ReallyAwesomeButton
      stretch
      backgroundColor={colors.primary}
      backgroundDarker="#3809C3"
      onNativePress={onPress}
    >
      <Headline style={{ color: 'white' }}>{children}</Headline>
    </ReallyAwesomeButton>
  );
};

export const AwesomeButtonMedium = ({
  children,
  onPress,
  style = undefined,
  type = 'filled'
}) => {
  const { colors } = useTheme();
  const outlined = type === 'outlined';
  return (
    <ReallyAwesomeButton
      stretch
      backgroundColor={colors.primary}
      backgroundDarker="#3809C3"
      onNativePress={onPress}
      height={50}
      style={style}
      {...(outlined
        ? {
            borderColor: colors.primary,
            borderWidth: 2,
            backgroundColor: 'white'
          }
        : {})}
    >
      <Headline
        style={{
          color: outlined ? colors.primary : 'white',
          fontSize: 20
        }}
      >
        {children}
      </Headline>
    </ReallyAwesomeButton>
  );
};

export default AwesomeButton;
