import React, { FC, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import {
  List,
  useTheme,
  Button,
  Title,
  Headline
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions
} from '@react-navigation/drawer';
import { AwesomeButtonMedium } from '../../AwesomeButton';
import db, { useActAuth, useSettings, useSync } from '@act/data/rn';
import { Box, Column, Columns, Stack } from '@mobily/stacks';
import { useKeycloak } from '@react-keycloak/native';
import KeycloakReactNativeClient from '@react-keycloak/native/lib/typescript/src/keycloak/client';
import { formatTimestamp } from '../formatTimestamp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SyncStatus } from '../../shared/components/SyncStatus';

MaterialCommunityIcons.loadFont();

const DrawerList: FC<
  DrawerContentComponentProps<DrawerContentOptions> & {
    theme: ReactNativePaper.Theme;
    keycloak: KeycloakReactNativeClient;
    setForceLogout: (forceLogout: boolean) => void;
  }
> = ({ navigation, theme, keycloak, setForceLogout }) => {
  const { currentUser } = useActAuth();
  const { sync, lastPulledAt: lpa, syncStatus } = useSync();
  const [lastPulledAt, setLastPulledAt] = useState<number>();
  const { setSettingsManager } = useSettings();

  useEffect(() => {
    if (typeof lpa === 'undefined') {
      AsyncStorage.getItem('lastPulledAt').then(
        (asyncLastPulledAt) => {
          if (asyncLastPulledAt) {
            setLastPulledAt(Number(asyncLastPulledAt));
          }
        }
      );
    } else {
      setLastPulledAt(lpa);
    }
  }, [lpa]);

  return (
    <>
      <Stack space={2} padding={5}>
        <Box>
          <Title style={{ fontFamily: 'Bebas-Regular' }}>
            {currentUser?.fullName}
          </Title>
          <Text>{currentUser?.username}</Text>
        </Box>
      </Stack>
      <ScrollView>
        <List.Item
          onPress={() => {
            navigation.navigate('Entry', {
              screen: 'CheckinBuilder'
            });
          }}
          style={{
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderBottomColor: theme.colors.primary,
            borderTopColor: theme.colors.primary
          }}
          titleStyle={{ fontSize: 25, fontFamily: 'Bebas-Regular' }}
          descriptionStyle={{
            fontFamily: 'Bebas-Regular'
          }}
          title={'Checkin Builder'}
          description={
            'Create a checkin for one or more achievements'
          }
          left={(props) => (
            <View
              style={{
                justifyContent: 'center'
              }}
            >
              <MaterialCommunityIcons
                name="checkbox-marked-circle-outline"
                color={theme.colors.primary}
                size={40}
              />
            </View>
          )}
        />
        <List.Item
          onPress={() => {
            navigation.navigate('Entry', { screen: 'Achievements' });
          }}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.primary
          }}
          titleStyle={{ fontSize: 25, fontFamily: 'Bebas-Regular' }}
          descriptionStyle={{
            fontFamily: 'Bebas-Regular'
          }}
          title={'Achievements'}
          description={
            'Find Achievements by Category and create a Checkin'
          }
          left={(props) => (
            <View
              style={{
                justifyContent: 'center'
              }}
            >
              <MaterialCommunityIcons
                name="star-circle-outline"
                color={theme.colors.primary}
                size={40}
              />
            </View>
          )}
        />
        <List.Item
          onPress={() => {
            navigation.navigate('Entry', { screen: 'Leaderboard' });
          }}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.primary
          }}
          titleStyle={{ fontSize: 25, fontFamily: 'Bebas-Regular' }}
          descriptionStyle={{
            fontFamily: 'Bebas-Regular'
          }}
          title={'Leaderboard'}
          description={'View users sorted by most points'}
          left={(props) => (
            <View
              style={{
                justifyContent: 'center'
              }}
            >
              <MaterialCommunityIcons
                name="format-list-numbered"
                color={theme.colors.primary}
                size={40}
              />
            </View>
          )}
        />
        <List.Item
          onPress={() => {
            navigation.navigate('Entry', { screen: 'UserCheckins' });
          }}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.primary
          }}
          titleStyle={{ fontSize: 25, fontFamily: 'Bebas-Regular' }}
          descriptionStyle={{
            fontFamily: 'Bebas-Regular'
          }}
          title={'User Checkins'}
          description={'view checkins by user'}
          left={(props) => (
            <View
              style={{
                justifyContent: 'center'
              }}
            >
              <MaterialCommunityIcons
                name="checkbox-multiple-marked-circle-outline"
                color={theme.colors.primary}
                size={40}
              />
            </View>
          )}
        />
        <List.Item
          onPress={() => {
            navigation.navigate('Entry', { screen: 'Uploads' });
          }}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.primary
          }}
          titleStyle={{ fontSize: 25, fontFamily: 'Bebas-Regular' }}
          descriptionStyle={{
            fontFamily: 'Bebas-Regular'
          }}
          title={'Uploads'}
          description={'View uploaded photos'}
          left={(props) => (
            <View
              style={{
                justifyContent: 'center'
              }}
            >
              <MaterialCommunityIcons
                name="camera"
                color={theme.colors.primary}
                size={40}
              />
            </View>
          )}
        />
        {currentUser?.admin && (
          <List.Item
            onPress={() => {
              navigation.navigate('Entry', {
                screen: 'PendingApprovals'
              });
            }}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.primary
            }}
            titleStyle={{ fontSize: 25, fontFamily: 'Bebas-Regular' }}
            descriptionStyle={{
              fontFamily: 'Bebas-Regular'
            }}
            title={'Pending Approvals'}
            description={
              'View checkins by non-admins that have not been approved'
            }
            left={(props) => (
              <View
                style={{
                  justifyContent: 'center'
                }}
              >
                <MaterialCommunityIcons
                  name="dots-horizontal-circle-outline"
                  color={theme.colors.primary}
                  size={40}
                />
              </View>
            )}
          />
        )}
        <Stack space={2}>
          <Box paddingTop={5} paddingX={5}>
            <AwesomeButtonMedium
              disabled={syncStatus === 'PROCESSING'}
              onPress={() => sync()}
            >
              Sync
            </AwesomeButtonMedium>
          </Box>
          {lastPulledAt && (
            <Box alignX="center">
              <Headline>Last Sync</Headline>
              <Text>{formatTimestamp(lastPulledAt)}</Text>
              <Box paddingTop={3}>
                <SyncStatus status={syncStatus} />
              </Box>
            </Box>
          )}
          <Box>
            <Columns>
              <Column>
                <Button
                  onPress={() => {
                    setForceLogout(true);
                    setSettingsManager(undefined);
                    (navigation as any).closeDrawer();
                  }}
                  labelStyle={{ fontFamily: 'Bebas-Regular' }}
                >
                  Logout
                </Button>
              </Column>
              <Column>
                <Button
                  onPress={() => {
                    navigation.navigate('Entry', {
                      screen: 'Settings'
                    });
                  }}
                  labelStyle={{ fontFamily: 'Bebas-Regular' }}
                >
                  Settings
                </Button>
              </Column>
            </Columns>
          </Box>
        </Stack>
      </ScrollView>
    </>
  );
};

const D = createDrawerNavigator();

const Drawer = ({ children }) => {
  const theme = useTheme();
  const { keycloak } = useKeycloak();
  const { setForceLogout } = useActAuth();
  return (
    <D.Navigator
      overlayColor="transparent"
      drawerPosition="right"
      drawerContent={(props) => (
        <DrawerList
          {...props}
          theme={theme}
          keycloak={keycloak}
          setForceLogout={setForceLogout}
        />
      )}
    >
      {children}
    </D.Navigator>
  );
};

export default Drawer;
