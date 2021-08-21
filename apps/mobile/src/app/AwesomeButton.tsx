import React from 'react';
import ReallyAwesomeButton from 'react-native-really-awesome-button';
import { Headline, useTheme } from 'react-native-paper';

const AwesomeButton = ({ children, onPress, disabled = false }) => {
  const { colors } = useTheme();

  //ALUMINUM: '#676B6D',
  //DARK_ALUMINUM: '#525557',
  return (
    <ReallyAwesomeButton
      stretch
      backgroundColor={disabled ? '#676B6D' : colors.primary}
      backgroundDarker="#3809C3"
      onNativePress={() => !disabled && onPress()}
      disabled={disabled}
    >
      <Headline
        style={{ color: 'white', fontFamily: 'Bebas-Regular' }}
      >
        {children}
      </Headline>
    </ReallyAwesomeButton>
  );
};

export const AwesomeButtonMedium = ({
  children,
  onPress,
  style = undefined,
  type = 'filled',
  disabled = false
}) => {
  const { colors } = useTheme();
  const outlined = type === 'outlined';
  return (
    <ReallyAwesomeButton
      stretch
      backgroundColor={disabled ? '#676B6D' : colors.primary}
      backgroundDarker="#3809C3"
      onNativePress={() => !disabled && onPress()}
      height={50}
      style={style}
      disabled={disabled}
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
          fontSize: 20,
          fontFamily: 'Bebas-Regular'
        }}
      >
        {children}
      </Headline>
    </ReallyAwesomeButton>
  );
};

export const AwesomeButtonSmall = ({
  children,
  onPress,
  style = undefined,
  type = 'filled',
  disabled = false
}) => {
  const { colors } = useTheme();
  const outlined = type === 'outlined';
  return (
    <ReallyAwesomeButton
      stretch
      backgroundColor={disabled ? '#676B6D' : colors.primary}
      backgroundDarker="#3809C3"
      onNativePress={() => !disabled && onPress()}
      height={30}
      style={style}
      disabled={disabled}
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
          fontSize: 20,
          fontFamily: 'Bebas-Regular'
        }}
      >
        {children}
      </Headline>
    </ReallyAwesomeButton>
  );
};

export default AwesomeButton;
