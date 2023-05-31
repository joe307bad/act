import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useState
} from 'react';
import { FAB, Headline, Searchbar } from 'react-native-paper';
import {
  createStackNavigator,
  StackHeaderProps
} from '@react-navigation/stack';
import { getHeaderTitle } from '@react-navigation/elements';
import { Appbar, useTheme } from 'react-native-paper';
import CheckinBuilder from './screens/CheckinBuilder';
import Achievements from './screens/Achievements';
import db, { useSettings, useSync } from '@act/data/rn';
import { Leaderboard } from './screens/Leaderboard';
import { PendingApprovals } from './screens/PendingApprovals';
import { UserCheckins } from './screens/UserCheckins';
import { CameraFab } from './shared/camera/CameraFab';
import { Settings } from './screens/Settings';
import { Uploads } from './screens/Uploads';
import {
  launchCamera,
  launchImageLibrary
} from './shared/camera/camera';

const Stack = createStackNavigator();
export const HeaderContext = createContext<{
  excludedPendingApprovals: Set<string>;
  setExcludedPendingApprovals: React.Dispatch<
    React.SetStateAction<Set<string>>
  >;
  searchCriteria: string;
  setSearchCriteria: React.Dispatch<React.SetStateAction<string>>;
}>(undefined);

const NavBar: (
  props: StackHeaderProps & { theme: ReactNativePaper.Theme }
) => ReactElement = ({ navigation, route, options, back }) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const {
    excludedPendingApprovals,
    searchCriteria,
    setSearchCriteria
  } = useContext(HeaderContext);
  const { sync } = useSync();

  const title = getHeaderTitle(options, route.name);

  const [showSearchBar, showSearchIcon] = ((): [boolean, boolean] => {
    if (route.name !== 'Achievements') {
      return [false, false];
    }

    if (showSearch) {
      return [true, false];
    }

    return [false, true];
  })();

  return (
    <Appbar.Header>
      {back ? (
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
      {route.name === 'PendingApprovals' && (
        <Appbar.Action
          icon="checkbox-multiple-marked-circle"
          onPress={() =>
            db.models.checkins.approveAllCheckins(
              excludedPendingApprovals
            )
          }
        />
      )}
      {route.name === 'Uploads' && (
        <Appbar.Action
          icon="file-image-outline"
          onPress={() => launchImageLibrary(sync)}
        />
      )}
      {route.name === 'Uploads' && (
        <Appbar.Action
          icon="camera-iris"
          onPress={() => launchCamera(sync)}
        />
      )}
      <Appbar.Action icon="refresh-circle" onPress={() => sync()} />
      <Appbar.Action
        icon="menu"
        onPress={() => (navigation as any).openDrawer()}
      />
    </Appbar.Header>
  );
};

const EntryStack = () => {
  const theme = useTheme();
  const [excludedPendingApprovals, setExcludedPendingApprovals] =
    useState<Set<string>>(new Set());
  const [searchCriteria, setSearchCriteria] = useState<string>('');
  const { settingsManager } = useSettings();
  const { hideCameraFab } = settingsManager ?? {};
  return (
    <>
      <HeaderContext.Provider
        value={{
          excludedPendingApprovals,
          setExcludedPendingApprovals,
          searchCriteria,
          setSearchCriteria
        }}
      >
        <Stack.Navigator
          initialRouteName="Achievements"
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
          <Stack.Screen
            name="Leaderboard"
            options={{ title: 'Leaderboard' }}
            component={Leaderboard}
          />
          <Stack.Screen
            name="PendingApprovals"
            options={{ title: 'Pending Approvals' }}
            component={PendingApprovals}
          />
          <Stack.Screen
            name="UserCheckins"
            options={{ title: 'User Checkins' }}
            component={UserCheckins}
          />
          <Stack.Screen
            name="Settings"
            options={{ title: 'Settings' }}
            component={Settings}
          />
          <Stack.Screen
            name="Uploads"
            options={{ title: 'Uploads' }}
            component={Uploads}
          />
        </Stack.Navigator>
      </HeaderContext.Provider>
      {!hideCameraFab && <CameraFab />}
    </>
  );
};

const Entry = () => {
  return <EntryStack />;
};

export default Entry;
