import React from 'react';
import ReallyAwesomeButton from 'react-native-really-awesome-button';
import { Headline, useTheme } from 'react-native-paper';

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

export const AwesomeButtonMedium = ({ children, onPress }) => {
  const { colors } = useTheme();
  return (
    <ReallyAwesomeButton
      stretch
      backgroundColor={colors.primary}
      backgroundDarker="#3809C3"
      onNativePress={onPress}
      height={50}
    >
      <Headline style={{ color: 'white', fontSize: 20 }}>
        {children}
      </Headline>
    </ReallyAwesomeButton>
  );
};

export default AwesomeButton;
