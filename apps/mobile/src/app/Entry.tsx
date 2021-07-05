import React from 'react';
import { useKeycloak } from '@react-keycloak/native';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActAuth } from '@act/data/rn';
import { Headline, useTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { Appbar } from 'react-native-paper';
import { ScreenContainer } from '../../re/Index.bs';

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

const HomeScreen = () => {
  const { keycloak, initialized } = useKeycloak();
  const { setForceLogout } = useActAuth();
  return (
    <ScreenContainer.make>
      <Button
        onPress={() => {
          setForceLogout(true);
          AsyncStorage.removeItem('currentUserId');
          keycloak.logout();
        }}
        title="Logout"
      />
    </ScreenContainer.make>
  );
};

export default Entry;
