import React from 'react';
import { Root } from '../../re/Index.bs';
import db from '@act/data/rn';

import {
  RNKeycloak,
  ReactNativeKeycloakProvider
} from '@react-keycloak/native';

const keycloak = new RNKeycloak({
  url: 'http://192.168.0.4:8080/auth',
  realm: 'master',
  clientId: 'account'
});

export default () => {
  //const achievements = db.useCollection('achievements');
  return (
    <ReactNativeKeycloakProvider
      authClient={keycloak}
      initOptions={{
        redirectUri: 'io.act.auth://io.act.host/CreateCheckin/'
      }}
    >
      <Root.make />
    </ReactNativeKeycloakProvider>
  );
};
