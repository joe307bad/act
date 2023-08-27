import React, { FC, useState, useEffect, useRef } from 'react';
import {
  RNKeycloak,
  ReactNativeKeycloakProvider
} from '@react-keycloak/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from './';
import { Platform } from 'react-native';
import Config from 'react-native-config';

const keycloak = new RNKeycloak({
  url: `${Config.KEYCLOAK_URL ?? 'http://192.168.0.4:8080'}`,
  realm: 'master',
  clientId: 'account'
});

export enum AuthStatus {
  Pending = 0,
  Authenticated = 1,
  Unauthenticated = 2
}

export type CurrentUser = {
  username: string;
  id: string;
  admin: boolean;
  fullName: string;
};

export const AuthContext = React.createContext<{
  currentUser?: CurrentUser;
  status?: AuthStatus;
  setForceLogout?: (forceLogout: boolean) => void;
  initialSyncComplete?: boolean;
  setInitialSyncComplete?: (initialSyncComplete?: boolean) => void;
}>({});

const KeycloakProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>();
  const [forceLogout, setForceLogout] =
    useState<boolean | undefined>();
  const loggingOut = useRef(false);

  useEffect(() => {
    if (forceLogout === true && loggingOut.current === false) {
      loggingOut.current = true;
      AsyncStorage.getItem('currentUserId').then((id) => {
        if (id) {
          AsyncStorage.removeItem('currentUserId');
          keycloak.logout();
        }
      });
    }
  }, [forceLogout]);

  useEffect(() => {
    AsyncStorage.getItem('currentUserId')
      .then((id) => {
        !id && setForceLogout(true);
        return db.models.users.find(id);
      })
      .then(
        (user) =>
          !!user &&
          setCurrentUser({
            username: user.username,
            id: user.id,
            admin: user.admin,
            fullName: user.fullName
          })
      );
  }, []);

  const status = (() => {
    if (typeof currentUser === 'undefined') {
      return AuthStatus.Pending;
    }

    if (forceLogout === true) {
      return AuthStatus.Unauthenticated;
    }

    return AuthStatus.Authenticated;
  })();

  const redirectUri = (() => {
    const scheme = 'io.act.auth';

    if (Platform.OS === 'ios') {
      return `${scheme}://`;
    }

    return `${scheme}://io.act.host/`;
  })();

  return (
    <ReactNativeKeycloakProvider
      authClient={keycloak}
      initOptions={{
        redirectUri: `${redirectUri}Achievements/`
      }}
      onEvent={async (ev) => {
        if (ev === 'onAuthSuccess') {
          const user = await db.models.users.insertIfDoesNotExist(
            keycloak.idToken
          );

          if (!user) {
            setForceLogout(true);
            return;
          }

          loggingOut.current = false;
          await AsyncStorage.setItem('currentUserId', user.id);
          setCurrentUser(user);
          setForceLogout(undefined);
        }
      }}
    >
      <AuthContext.Provider
        value={{
          currentUser,
          status,
          setForceLogout
        }}
      >
        {children}
      </AuthContext.Provider>
    </ReactNativeKeycloakProvider>
  );
};

export default KeycloakProvider;
