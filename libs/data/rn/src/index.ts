import 'reflect-metadata';
import { useContext } from 'react';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { registryFactory, schemaAndMigrations } from '@act/data/core';
import KeycloakProvider, { AuthContext } from './KeycloakProvider';
import Config from 'react-native-config';

export default registryFactory(
  new SQLiteAdapter(schemaAndMigrations),
  Config as { ACT_API_URL: string; KEYCLOAK_URL: string }
);

const useActAuth = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};

export { KeycloakProvider, useActAuth };
