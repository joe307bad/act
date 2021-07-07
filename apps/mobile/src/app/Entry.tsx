import React, { FC } from 'react';
import { Headline, useTheme } from 'react-native-paper';
import {
  createStackNavigator,
  StackHeaderProps
} from '@react-navigation/stack';
import { Appbar } from 'react-native-paper';
import CreateCheckin from './screens/CreateCheckin';
import {
  useNavigation,
  useNavigationState,
  useRoute
} from '@react-navigation/native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// <MaterialCommunityIcons
//           name="close-circle-outline"
//           color={theme.colors.primary}
//           size={20}
//         />

//MaterialCommunityIcons.loadFont();

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
const getActiveRouteName = (state) => {
  const route = state.routes[state?.index || 0];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};
const Entry = () => {
  const title = React.useRef();
  return (
    <Stack.Navigator
      initialRouteName="CreateCheckin"
      screenOptions={{
        header: NavBar
      }}
    >
      <Stack.Screen
        name="CreateCheckin"
        options={{ title: 'Create Checkin' }}
        component={CreateCheckin}
      />
    </Stack.Navigator>
  );
};

export default Entry;
