import { FAB, useTheme } from 'react-native-paper';
import React from 'react';
import { useSync } from '@act/data/rn';
import { launchCamera } from './camera';

export const CameraFab = () => {
  const theme = useTheme();
  const { sync } = useSync();

  return (
    <FAB
      style={{
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.primary
      }}
      color={'white'}
      icon="camera-iris"
      onPress={() => launchCamera(sync)}
    />
  );
};
