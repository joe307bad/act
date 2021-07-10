import { NavigationContainer } from '@react-navigation/native';
import React, { FC } from 'react';
import { View } from 'react-native';
import { List, useTheme, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions
} from '@react-navigation/drawer';
import { AwesomeButtonMedium } from '../../AwesomeButton';
import db, { useActAuth } from '@act/data/rn';
import { Box, Stack } from '@mobily/stacks';
import { useKeycloak } from '@react-keycloak/native';
import KeycloakReactNativeClient from '@react-keycloak/native/lib/typescript/src/keycloak/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

MaterialCommunityIcons.loadFont();

const DrawerList: FC<
  DrawerContentComponentProps<DrawerContentOptions> & {
    theme: ReactNativePaper.Theme;
    keycloak: KeycloakReactNativeClient;
    setForceLogout: (forceLogout: boolean) => void;
  }
> = ({ navigation, theme, keycloak, setForceLogout }) => {
  return (
    <>
      <List.Item
        onPress={() => {
          navigation.navigate('Entry', { screen: 'CreateCheckin' });
        }}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.primary
        }}
        titleStyle={{ fontSize: 25 }}
        title={'Create Checkin'}
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
        titleStyle={{ fontSize: 25 }}
        title={'Achievements'}
        description={'View Achievements and Categories'}
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
      <Stack space={2} padding={5}>
        <Box>
          <AwesomeButtonMedium onPress={() => db.sync()}>
            Sync
          </AwesomeButtonMedium>
        </Box>
        <Box>
          <Button
            onPress={() => {
              setForceLogout(true);
              AsyncStorage.removeItem('currentUserId');
              keycloak.logout();
            }}
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
      openByDefault
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
