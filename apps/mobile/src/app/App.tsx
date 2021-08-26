import React from 'react';
import { Root } from '../../re/Index.bs';
import { KeycloakProvider } from '@act/data/rn';
import Bugsnag from '@bugsnag/react-native';
import Config from 'react-native-config';
import { GlobalContextProvider } from './core/providers/GlobalContextProvider';

if (Config.ENABLE_BUGSNAG) {
  Bugsnag.start();
}

export default () => (
  <GlobalContextProvider>
    <KeycloakProvider>
      <Root.make />
    </KeycloakProvider>
  </GlobalContextProvider>
);
