import { useActAuth } from '@act/data/rn';
import React from 'react';
import {
  useTheme,
  ActivityIndicator,
  Card,
  Surface
} from 'react-native-paper';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AwesomeButtonSmall } from '../../AwesomeButton';
import db from '@act/data/rn';
import {
  Box,
  Column,
  Columns,
  FillView,
  Row,
  Rows
} from '@mobily/stacks';

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
      <Columns alignX="center">
        <Column height={'1/2'} width={'1/2'}>
          <Rows space={2} alignX="center">
            <Row height="content" padding={2}>
              <Text style={{ textAlign: 'center' }}>
                {syncStatus}
              </Text>
            </Row>
            <Row height="content">
              <View style={{ alignItems: 'center' }}>
                <Icon />
              </View>
            </Row>
            <Row width="1/2" height="content">
              <Box margin={2}>
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
              </Box>
            </Row>
          </Rows>
        </Column>
      </Columns>
    </FillView>
  );
};

export default SyncStatus;
