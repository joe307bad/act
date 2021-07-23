import { useActAuth } from '@act/data/rn';
import React from 'react';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SyncStatus = () => {
  const theme = useTheme();
  let { initialSyncComplete } = useActAuth();
  return (
    <View
      style={{
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center'
      }}
    >
      {initialSyncComplete ? (
        <MaterialCommunityIcons
          name="checkbox-marked-circle-outline"
          color={theme.colors.primary}
          size={30}
        />
      ) : (
        <ActivityIndicator animating={true} />
      )}
    </View>
  );
};

export default SyncStatus;
