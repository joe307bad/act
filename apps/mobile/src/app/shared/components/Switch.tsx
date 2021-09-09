import { useTheme } from 'react-native-paper';
import { Switch as S } from 'react-native-paper';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { debounce } from 'lodash';
import { Box } from '@mobily/stacks';
import { Platform } from 'react-native';
import { useSync } from '@act/data/rn';
import { useDebounce } from '@act/data/core';

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
  disableWhileSyncing = false,
  forceDisable = false,
  onPress = undefined,
  value
}) => {
  const theme = useTheme();
  const [checked, setChecked] = useState<boolean>(value);
  const [disabled, setDisabled] = useState<boolean>(false);
  const debouncedChecked = useDebounce(checked, 100);
  const { syncStatus } = useSync();
  const loaded = useRef(false);
  const afterFirstSelection = useRef(false);

  useEffect(() => {
    if (loaded.current === true) {
      onPress?.();
    }
    loaded.current = true;
  }, [debouncedChecked]);

  useEffect(() => {
    if (disableWhileSyncing && afterFirstSelection.current === true) {
      if (!disabled) {
        console.log('disabled');
        setDisabled(true);
      } else if (syncStatus === 'SUCCESS') {
        setDisabled(false);
      }
    }
  }, [checked, syncStatus]);

  return (
    <Box paddingLeft={Platform.OS === 'ios' ? 2 : 0}>
      <S
        disabled={forceDisable === true ? true : disabled}
        trackColor={{
          false: theme.colors.backdrop,
          true: theme.colors.backdrop
        }}
        thumbColor={theme.colors.primary}
        color={theme.colors.primary}
        value={checked}
        onValueChange={() => {
          afterFirstSelection.current = true;
          setChecked(!checked);
        }}
      />
    </Box>
  );
};
