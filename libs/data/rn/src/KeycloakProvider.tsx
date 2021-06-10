import React, { FC } from 'react';
import {
  RNKeycloak,
  ReactNativeKeycloakProvider,
  useKeycloak
} from '@react-keycloak/native';

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
  >
    {children}
  </ReactNativeKeycloakProvider>
);

export default KeycloakProvider;
