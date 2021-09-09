import { useTheme } from 'react-native-paper';
import { Switch as S } from 'react-native-paper';
import React, { useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { Box } from '@mobily/stacks';
import { Platform } from 'react-native';

function useThrottle(cb, delay) {
  const options = { leading: true, trailing: false };
  const inputsRef = useRef({ cb, delay });
  useEffect(() => {
    inputsRef.current = { cb, delay };
  });
  return useCallback(
    debounce(
      (...args) => {
        if (inputsRef.current.delay === delay)
          inputsRef.current.cb(...args);
      },
      delay,
      options
    ),
    [delay, debounce]
  );
}

export const Switch = ({
  value,
  disabled = false,
  onPress = undefined
}) => {
  const theme = useTheme();
  const debounced = useThrottle(() => onPress(), 100);
  return (
    <Box paddingLeft={Platform.OS === 'ios' ? 2 : 0}>
      <S
        disabled={disabled}
        trackColor={{
          false: theme.colors.backdrop,
          true: theme.colors.backdrop
        }}
        thumbColor={theme.colors.primary}
        color={theme.colors.primary}
        value={value}
        onTouchEndCapture={debounced}
      />
    </Box>
  );
};
