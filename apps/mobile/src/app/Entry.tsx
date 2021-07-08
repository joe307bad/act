import React, { FC } from 'react';
import { Headline } from 'react-native-paper';
import {
  createStackNavigator,
  StackHeaderProps
} from '@react-navigation/stack';
import { Appbar } from 'react-native-paper';
import CreateCheckin from './screens/CreateCheckin';
import Achievements from './screens/Achievements';

const Stack = createStackNavigator();

const NavBar: (props: StackHeaderProps) => React.ReactNode = ({
  scene
}) => {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;
  return (
    <Appbar.Header>
      <Appbar.Content
        title={
          <Headline style={{ color: 'white' }}>{title}</Headline>
        }
      />
    </Appbar.Header>
  );
};

const Entry = () => {
  return (
    <Stack.Navigator
      initialRouteName="CreateCheckin"
      headerMode="float"
      screenOptions={{
        header: NavBar
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
