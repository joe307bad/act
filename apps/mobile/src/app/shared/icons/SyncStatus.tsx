import { useActAuth } from '@act/data/rn';
import React from 'react';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import { Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AwesomeButtonSmall } from '../../AwesomeButton';
import db from '@act/data/rn';
import { Column, Columns, FillView } from '@mobily/stacks';

const Icon = () => {
  const theme = useTheme();
  let { initialSyncComplete, syncFailed } = useActAuth();
  if (syncFailed) {
    return (
      <MaterialCommunityIcons
        name="network-strength-1-alert"
        color={theme.colors.error}
        size={30}
      />
    );
  }

  return initialSyncComplete ? (
    <MaterialCommunityIcons
      name="checkbox-marked-circle-outline"
      color={theme.colors.primary}
      size={30}
    />
  ) : (
    <ActivityIndicator animating={true} />
  );
};

const SyncStatus = () => {
  let {
    initialSyncComplete,
    syncFailed,
    setSyncFailed,
    setInitialSyncComplete
  } = useActAuth();
  const syncStatus = syncFailed
    ? 'Sync failed'
    : initialSyncComplete
    ? 'Sync Successful'
    : 'Performing synchronization...';
  return (
    <FillView alignX="bottom" alignY="bottom">
      <Columns alignY="center" alignX="center">
        <Column width="content">
          <Text>{syncStatus}</Text>
        </Column>
        <Column padding={2}>
          <Icon />
        </Column>
        <Column width="1/5">
          <AwesomeButtonSmall
            disabled={!syncFailed}
            onPress={() => {
              setSyncFailed(false);

              db.sync()
                .then(() => {
                  setSyncFailed(false);
                  setInitialSyncComplete(true);
                })
                .catch((e) => {
                  setSyncFailed(true);
                  setInitialSyncComplete(false);
                });
            }}
          >
            Retry
          </AwesomeButtonSmall>
        </Column>
      </Columns>
    </FillView>
  );
};

export default SyncStatus;
