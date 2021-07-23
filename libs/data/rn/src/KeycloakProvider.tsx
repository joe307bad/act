import React, { FC, useState, useEffect } from 'react';
import k, {
  RNKeycloak,
  ReactNativeKeycloakProvider,
  useKeycloak
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

export const AuthContext = React.createContext<{
  currentUserId?: string;
  status?: AuthStatus;
  setForceLogout?: (forceLogout: boolean) => void;
  initialSyncComplete?: boolean;
}>({});

const KeycloakProvider: FC = ({ children }) => {
  const [initialSyncComplete, setInitialSyncComplete] =
    useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [forceLogout, setForceLogout] =
    useState<boolean | undefined>();

  useEffect(() => {
    if (currentUserId) {
      AsyncStorage.setItem('currentUserId', currentUserId);
    }
  }, [currentUserId]);

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

    return !!asyncStorageUserId.result || currentUserId
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
          setCurrentUserId(
            await db.models.users.insertIfDoesNotExist(
              keycloak.idToken
            )
          );
          setForceLogout(undefined);
        }
      }}
    >
      <AuthContext.Provider
        value={{
          currentUserId,
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
