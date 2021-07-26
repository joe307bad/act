import 'reflect-metadata';
import { useContext } from 'react';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { registryFactory, schemaAndMigrations } from '@act/data/core';
import KeycloakProvider, { AuthContext } from './KeycloakProvider';

export default registryFactory(
  new SQLiteAdapter(schemaAndMigrations)
);

const useActAuth = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};

export { KeycloakProvider, useActAuth };
