import React, {
  createContext,
  ReactElement,
  useContext,
  useState
} from 'react';
import { FAB, Headline, Searchbar } from 'react-native-paper';
import {
  createStackNavigator,
  StackHeaderProps
} from '@react-navigation/stack';
import { Appbar, useTheme } from 'react-native-paper';
import CheckinBuilder from './screens/CheckinBuilder';
import Achievements from './screens/Achievements';
import db, { useSync } from '@act/data/rn';
import { Leaderboard } from './screens/Leaderboard';
import { PendingApprovals } from './screens/PendingApprovals';
import { UserCheckins } from './screens/UserCheckins';
import * as ImagePicker from 'react-native-image-picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import Config from 'react-native-config';

const Stack = createStackNavigator();
export const HeaderContext =
  createContext<{
    excludedPendingApprovals: Set<string>;
    setExcludedPendingApprovals: React.Dispatch<
      React.SetStateAction<Set<string>>
    >;
    searchCriteria: string;
    setSearchCriteria: React.Dispatch<React.SetStateAction<string>>;
  }>(undefined);

const NavBar: (
  props: StackHeaderProps & { theme: ReactNativePaper.Theme }
) => ReactElement = ({ scene, previous, navigation }) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const {
    excludedPendingApprovals,
    searchCriteria,
    setSearchCriteria
  } = useContext(HeaderContext);
  const { sync } = useSync();

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
      {scene.route.name === 'PendingApprovals' && (
        <Appbar.Action
          icon="checkbox-multiple-marked-circle"
          onPress={() =>
            db.models.checkins.approveAllCheckins(
              excludedPendingApprovals
            )
          }
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

const selectPhotoTapped = async () => {
  const options = {
    title: 'Select Photo',
    mediaType: 'photo' as ImagePicker.MediaType,
    saveToPhotos: true,
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };

  await request(PERMISSIONS.ANDROID.CAMERA);

  ImagePicker.launchCamera(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else {
      const uri = response.assets[0].uri;
      const type = response.assets[0].type;
      const name = response.assets[0].fileName;

      const data = new FormData();
      data.append('file', {
        name,
        type,
        uri
      });
      data.append('upload_preset', Config.CLOUDINARY_UPLOAD_PRESET);
      fetch(Config.CLOUDINARY_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

const EntryStack = () => {
  const theme = useTheme();
  const [excludedPendingApprovals, setExcludedPendingApprovals] =
    useState<Set<string>>(new Set());
  const [searchCriteria, setSearchCriteria] = useState<string>('');
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
        </Stack.Navigator>
      </HeaderContext.Provider>

      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.primary
        }}
        color={'white'}
        icon="camera"
        onPress={selectPhotoTapped}
      />
    </>
  );
};

const Entry = () => {
  return <EntryStack />;
};

export default Entry;
