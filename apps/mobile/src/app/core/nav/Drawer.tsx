import React, { FC } from 'react';
import { View, Text } from 'react-native';
import { List, useTheme, Button, Title } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions
} from '@react-navigation/drawer';
import { AwesomeButtonMedium } from '../../AwesomeButton';
import db, { useActAuth, useSync } from '@act/data/rn';
import { Box, Stack } from '@mobily/stacks';
import { useKeycloak } from '@react-keycloak/native';
import KeycloakReactNativeClient from '@react-keycloak/native/lib/typescript/src/keycloak/client';

MaterialCommunityIcons.loadFont();

const DrawerList: FC<
  DrawerContentComponentProps<DrawerContentOptions> & {
    theme: ReactNativePaper.Theme;
    keycloak: KeycloakReactNativeClient;
    setForceLogout: (forceLogout: boolean) => void;
  }
> = ({ navigation, theme, keycloak, setForceLogout }) => {
  const { currentUser } = useActAuth();
  const sync = useSync();

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
      <List.Item
        onPress={() => {
          navigation.navigate('Entry', { screen: 'CheckinBuilder' });
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
        description={'Create a checkin for one or more achievements'}
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
      <Stack space={2} padding={5}>
        <Box>
          <AwesomeButtonMedium onPress={() => sync()}>
            Sync
          </AwesomeButtonMedium>
        </Box>
        <Box>
          <Button
            onPress={() => {
              setForceLogout(true);
              (navigation as any).closeDrawer();
            }}
            labelStyle={{ fontFamily: 'Bebas-Regular' }}
            //style={{ fontFamily: 'Bebas-Regular' }}
          >
            Logout
          </Button>
        </Box>
      </Stack>
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
