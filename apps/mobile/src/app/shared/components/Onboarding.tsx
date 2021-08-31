import db, {
  useActAuth,
  useSync,
  useEnvironment
} from '@act/data/rn';
import React, { useEffect, useState } from 'react';
import {
  useTheme,
  ActivityIndicator,
  Switch,
  Card,
  Headline,
  TouchableRipple
} from 'react-native-paper';
import { Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AwesomeButtonSmall } from '../../AwesomeButton';
import {
  Box,
  Column,
  Columns,
  FillView,
  Row,
  Rows,
  Stack
} from '@mobily/stacks';
import Modal from './Modal';
import Chip from './Chip';
import { format } from 'date-fns';
import { useKeycloak } from '@react-keycloak/native';

const Onboarding = () => {
  const {
    usingTestEnvironment,
    installTimestamp,
    isFreshInstall,
    launchTimestamp
  } = useEnvironment();
  const sync = useSync();
  const theme = useTheme();
  const [showEnvironementDetails, setShowEnvironmentDetails] =
    useState(false);
  const [syncStatus, setSyncStatus] =
    useState<'SUCCESS' | 'FAILURE' | 'PROCESSING' | 'INITIAL'>(
      'INITIAL'
    );

  const { keycloak } = useKeycloak();

  return (
    <>
      <FillView style={{ justifyContent: 'flex-end' }}>
        <Card elevation={5}>
          <Stack padding={2} space={2}>
            <Box></Box>
            <Headline>Welcome to the Act App</Headline>
            <Columns paddingTop={2} paddingBottom={2} alignY="center">
              <Column paddingRight={2} width="content">
                <MaterialCommunityIcons
                  name={`numeric-1-box`}
                  color={theme.colors.primary}
                  size={25}
                />
              </Column>
              <Column>
                <Text>Select Environment</Text>
              </Column>
              <Column width="content">
                <Columns alignY="center">
                  <Column width="content">
                    <Text>Prod</Text>
                  </Column>
                  <Column width="content">
                    <Switch
                      disabled={true}
                      trackColor={{
                        false: theme.colors.backdrop,
                        true: theme.colors.backdrop
                      }}
                      thumbColor={theme.colors.primary}
                      color={theme.colors.primary}
                      value={usingTestEnvironment}
                    />
                  </Column>
                  <Column paddingLeft={2} width="content">
                    <Text>Test</Text>
                  </Column>
                </Columns>
              </Column>
              <Column paddingLeft={2} width="content">
                <TouchableRipple
                  onPress={() => setShowEnvironmentDetails(true)}
                >
                  <MaterialCommunityIcons
                    name="information-outline"
                    color={theme.colors.primary}
                    size={30}
                  />
                </TouchableRipple>
              </Column>
            </Columns>
            <Columns alignY="center" alignX="center">
              <Column paddingRight={2} width="content">
                <MaterialCommunityIcons
                  name={`numeric-2-box`}
                  color={theme.colors.primary}
                  size={25}
                />
              </Column>
              <Column>
                <Columns alignY="center">
                  <Column width="content">
                    <Text>
                      {(() => {
                        switch (syncStatus) {
                          case 'PROCESSING':
                            return 'Performing Sync';
                          case 'SUCCESS':
                            return 'Sync Successfull';
                          case 'FAILURE':
                            return 'Sync Failed, try again';
                          default:
                            return 'Perform Sync';
                        }
                      })()}
                    </Text>
                  </Column>
                  <Column width="content" paddingLeft={3}>
                    {(() => {
                      switch (syncStatus) {
                        case 'PROCESSING':
                          return <ActivityIndicator />;
                        case 'SUCCESS':
                          return (
                            <MaterialCommunityIcons
                              name={`checkbox-marked-circle-outline`}
                              color={theme.colors.primary}
                              size={25}
                            />
                          );
                        case 'FAILURE':
                          return (
                            <MaterialCommunityIcons
                              name={`network-strength-1-alert`}
                              color={theme.colors.error}
                              size={25}
                            />
                          );
                      }
                    })()}
                  </Column>
                </Columns>
              </Column>
              <Column width="1/5">
                <AwesomeButtonSmall
                  disabled={
                    syncStatus === 'SUCCESS' ||
                    syncStatus === 'PROCESSING'
                  }
                  onPress={() => {
                    setSyncStatus('PROCESSING');

                    sync()
                      .then(({ rejectSyncGracefully }) => {
                        if (rejectSyncGracefully) {
                          return;
                        }
                        setSyncStatus('SUCCESS');
                      })
                      .catch((e) => {
                        setSyncStatus('FAILURE');
                      });
                  }}
                >
                  Sync
                </AwesomeButtonSmall>
              </Column>
            </Columns>
            <Columns alignY="center" alignX="center">
              <Column paddingRight={2} width="content">
                <MaterialCommunityIcons
                  name={`numeric-3-box`}
                  color={theme.colors.primary}
                  size={25}
                />
              </Column>
              <Column>
                <Text>Authorize using Keycloak</Text>
              </Column>
              <Column width="1/4">
                <AwesomeButtonSmall
                  disabled={syncStatus !== 'SUCCESS'}
                  onPress={() => keycloak.login()}
                >
                  Authorize
                </AwesomeButtonSmall>
              </Column>
            </Columns>
          </Stack>
        </Card>
      </FillView>
      <Modal
        title={'Environment Details'}
        dismissText={'Dismiss'}
        onDismiss={() => {
          setShowEnvironmentDetails(false);
        }}
        visible={showEnvironementDetails}
      >
        <Rows>
          <Row>
            <Columns alignY="center">
              <Column>
                <Text>Launch Date</Text>
              </Column>
              <Column width="content">
                <Chip
                  icon="calendar"
                  title={format(launchTimestamp, 'EEE MMM do @ pp')}
                />
              </Column>
            </Columns>
          </Row>
          <Row>
            <Columns alignY="center">
              <Column>
                <Text>Your Install Date</Text>
              </Column>
              <Column width="content">
                <Chip
                  icon="calendar"
                  title={format(installTimestamp, 'EEE MMM do @ pp')}
                />
              </Column>
            </Columns>
          </Row>
        </Rows>
        <Rows space={2} paddingBottom={usingTestEnvironment ? 0 : 2}>
          <Row paddingTop={3}>
            <Columns>
              <Column paddingRight={2} width="content">
                <Text>•</Text>
              </Column>
              <Column>
                <Text>
                  You are using the{' '}
                  {usingTestEnvironment ? 'Test' : 'Prod'}{' '}
                  environment.
                </Text>
              </Column>
            </Columns>
          </Row>
        </Rows>
        {usingTestEnvironment && (
          <Rows space={2} paddingBottom={2}>
            <Row paddingTop={2}>
              <Headline style={{ fontSize: 20 }}>
                How to switch to the Prod Environment:
              </Headline>
            </Row>
            <Row>
              <Columns>
                <Column paddingRight={2} width="content">
                  <Text>•</Text>
                </Column>
                <Column>
                  <Text>
                    The Prod environment will be available after the
                    launch date.
                  </Text>
                </Column>
              </Columns>
            </Row>
            {!isFreshInstall && (
              <Row>
                <Columns>
                  <Column paddingRight={2} width="content">
                    <Text>•</Text>
                  </Column>
                  <Column>
                    <Text>
                      You are not performing a fresh install. To
                      switch environments, remove and reinstall the
                      app.
                    </Text>
                  </Column>
                </Columns>
              </Row>
            )}
            <Row>
              <Columns>
                <Column paddingRight={2} width="content">
                  <Text>•</Text>
                </Column>
                <Column>
                  <Text>
                    To access the Prod environment, you will be
                    required to remove and reinstall the app after the
                    launch date.
                  </Text>
                </Column>
              </Columns>
            </Row>
            <Row>
              <Columns>
                <Column paddingRight={2} width="content">
                  <Text>•</Text>
                </Column>
                <Column>
                  <Text>
                    After reinstalling after the launch date, you will
                    be forced to use the Prod environment.
                  </Text>
                </Column>
              </Columns>
            </Row>
          </Rows>
        )}
      </Modal>
    </>
  );
};

export default Onboarding;
