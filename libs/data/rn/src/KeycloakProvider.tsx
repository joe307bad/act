import React, { FC } from 'react';
import {
  RNKeycloak,
  ReactNativeKeycloakProvider,
  useKeycloak
} from '@react-keycloak/native';
import db from './';

const keycloak = new RNKeycloak({
  url: 'http://192.168.0.4:8080/auth',
  realm: 'master',
  clientId: 'account'
});

const KeycloakProvider: FC = ({ children }) => (
  <ReactNativeKeycloakProvider
    authClient={keycloak}
    initOptions={{
      redirectUri: 'io.act.auth://io.act.host/CreateCheckin/'
    }}
    onTokens={(tokens) => {
      // TODO create user if does not exist
      db.models.users.insertIfDoesNotExist(tokens.idToken);
    }}
  >
    {children}
  </ReactNativeKeycloakProvider>
);

export default KeycloakProvider;
