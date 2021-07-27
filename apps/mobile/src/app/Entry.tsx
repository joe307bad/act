import React, { FC, ReactElement } from 'react';
import { Headline } from 'react-native-paper';
import {
  createStackNavigator,
  StackHeaderProps
} from '@react-navigation/stack';
import { Appbar, useTheme } from 'react-native-paper';
import CreateCheckin from './screens/CreateCheckin';
import Achievements from './screens/Achievements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import db from '@act/data/rn';

const Stack = createStackNavigator();

const NavBar: (
  props: StackHeaderProps & { theme: ReactNativePaper.Theme }
) => ReactElement = ({ scene, previous, navigation }) => {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;
  return (
    <Appbar.Header>
      {previous ? (
        <Appbar.BackAction onPress={navigation.goBack} />
      ) : null}

      <Appbar.Content
        title={
          <Headline style={{ color: 'white' }}>{title}</Headline>
        }
      />
      <Appbar.Action
        icon="refresh-circle"
        onPress={() => db.sync()}
      />
      <Appbar.Action
        icon="menu"
        onPress={() => (navigation as any).openDrawer()}
      />
    </Appbar.Header>
  );
};

const Entry = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="CreateCheckin"
      headerMode="float"
      screenOptions={{
        header: (props) => <NavBar {...props} theme={theme} />
      }}
    >
      <Stack.Screen
        name="CreateCheckin"
        options={{ title: 'Create Checkin' }}
        component={CreateCheckin}
      />
      <Stack.Screen
        name="Achievements"
        options={{ title: 'Achievements' }}
        component={Achievements}
      />
    </Stack.Navigator>
  );
};

export default Entry;
