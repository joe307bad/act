import React, { FC, useState, useEffect } from 'react';
import k, {
  RNKeycloak,
  ReactNativeKeycloakProvider
} from '@react-keycloak/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db, { useCurrentUserId } from './';

const keycloak = new RNKeycloak({
  url: 'http://192.168.0.4:8080/auth',
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
};

export const AuthContext = React.createContext<{
  currentUser?: CurrentUser;
  status?: AuthStatus;
  setForceLogout?: (forceLogout: boolean) => void;
  initialSyncComplete?: boolean;
}>({});

const KeycloakProvider: FC = ({ children }) => {
  const [initialSyncComplete, setInitialSyncComplete] =
    useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>();
  const [forceLogout, setForceLogout] =
    useState<boolean | undefined>();

  useEffect(() => {
    if (currentUser) {
      AsyncStorage.setItem('currentUserId', currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    db.sync()
      .then(() => setInitialSyncComplete(true))
      .catch((e) => setInitialSyncComplete(false));
  }, []);

  const asyncStorageUserId = useCurrentUserId();
  const status = (() => {
    if (asyncStorageUserId.state === 'pending') {
      return AuthStatus.Pending;
    }

    if (forceLogout === true) {
      return AuthStatus.Unauthenticated;
    }

    return !!asyncStorageUserId.result || currentUser
      ? AuthStatus.Authenticated
      : AuthStatus.Unauthenticated;
  })();

  return (
    <ReactNativeKeycloakProvider
      authClient={keycloak}
      initOptions={{
        redirectUri: 'io.act.auth://io.act.host/CreateCheckin/'
      }}
      onEvent={async (ev) => {
        if (ev === 'onAuthSuccess') {
          const user = await db.models.users.insertIfDoesNotExist(
            keycloak.idToken
          );

          setCurrentUser(user);
          setForceLogout(undefined);
        }
      }}
    >
      <AuthContext.Provider
        value={{
          currentUser,
          status,
          setForceLogout,
          initialSyncComplete
        }}
      >
        {children}
      </AuthContext.Provider>
    </ReactNativeKeycloakProvider>
  );
};

export default KeycloakProvider;
