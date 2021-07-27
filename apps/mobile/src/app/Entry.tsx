import React, { ReactElement, useState } from 'react';
import { Headline, Searchbar } from 'react-native-paper';
import {
  createStackNavigator,
  StackHeaderProps
} from '@react-navigation/stack';
import { Appbar, useTheme } from 'react-native-paper';
import CheckinBuilder from './screens/CheckinBuilder';
import Achievements from './screens/Achievements';
import db from '@act/data/rn';

const Stack = createStackNavigator();

const NavBar: (
  props: StackHeaderProps & { theme: ReactNativePaper.Theme }
) => ReactElement = ({ scene, previous, navigation }) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // TODO this search criteria should sort the achievements list
  const [searchCriteria, setSearchCriteria] = useState<string>('');

  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  const [showSearchBar, showSearchIcon] = ((): [boolean, boolean] => {
    if (scene.route.name !== 'Achievements') {
      return [false, false];
    }

    if (showSearch) {
      return [true, false];
    }

    return [false, true];
  })();

  return (
    <Appbar.Header>
      {previous ? (
        <Appbar.BackAction onPress={navigation.goBack} />
      ) : null}
      {showSearchBar ? (
        <Searchbar
          style={{ flex: 1 }}
          textAlign="left"
          value={searchCriteria}
          onChangeText={setSearchCriteria}
          onEndEditing={() => {}}
          onIconPress={() => setShowSearch(false)}
        />
      ) : (
        <Appbar.Content
          title={
            <Headline style={{ color: 'white' }}>{title}</Headline>
          }
        />
      )}
      {showSearchIcon && (
        <Appbar.Action
          icon="magnify"
          onPress={() => setShowSearch(true)}
        />
      )}
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
      initialRouteName="CheckinBuilder"
      headerMode="float"
      screenOptions={{
        header: (props) => <NavBar {...props} theme={theme} />
      }}
    >
      <Stack.Screen
        name="CheckinBuilder"
        options={{ title: 'Checkin Builder' }}
        component={CheckinBuilder}
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
