import React from 'react';
import { Root } from '../../re/Index.bs';
import { KeycloakProvider } from '@act/data/rn';
import Bugsnag from '@bugsnag/react-native';

Bugsnag.start();

export default () => {
  return (
    <KeycloakProvider>
      <Root.make />
    </KeycloakProvider>
  );
};
