import React from 'react';
import { Root } from '../../re/Index.bs';
import { KeycloakProvider } from '@act/data/rn';

export default () => (
  <KeycloakProvider>
    <Root.make />
  </KeycloakProvider>
);
