import React, { FC } from 'react';
import { useKeycloak } from '@react-keycloak/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActAuth } from '@act/data/rn';
import { Headline, useTheme, Button } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { Appbar } from 'react-native-paper';
import Selector from './shared/components/Selector';
import { ScreenContainer } from '../../re/Index.bs';
import db from '@act/data/rn';
import { User } from '@act/data/core';
import Modal from './shared/components/Modal';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// <MaterialCommunityIcons
//           name="close-circle-outline"
//           color={theme.colors.primary}
//           size={20}
//         />

//MaterialCommunityIcons.loadFont();

const Stack = createStackNavigator();

function NavBar() {
  const theme = useTheme();
  return (
    <Appbar.Header>
      <Appbar.Content
        title={
          <Headline style={{ color: 'white' }}>Home Screen</Headline>
        }
      />
    </Appbar.Header>
  );
}

const Entry = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: NavBar
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

const HomeScreen: FC = () => {
  const { keycloak } = useKeycloak();
  const { setForceLogout } = useActAuth();
  return (
    <ScreenContainer.make>
      <Selector />
      <Button
        onPress={() => {
          setForceLogout(true);
          AsyncStorage.removeItem('currentUserId');
          keycloak.logout();
        }}
      >
        Logout
      </Button>
    </ScreenContainer.make>
  );
};

export default Entry;
