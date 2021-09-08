import 'reflect-metadata';
import { useContext } from 'react';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { registryFactory, schemaAndMigrations } from '@act/data/core';
import KeycloakProvider, { AuthContext } from './KeycloakProvider';
import Config from 'react-native-config';
import {
  useEnvironment,
  EnvironmentProvider
} from './EnvironmentProvider';
import { useSync, SyncProvider } from './SyncProvider';
import { useSettings, SettingsProvider } from './SettingsProvider';
import {
  useGlobalContext,
  GlobalContextProvider
} from './GlobalContextProvider';

export default registryFactory(
  new SQLiteAdapter(schemaAndMigrations),
  Config as { ACT_API_URL: string; KEYCLOAK_URL: string }
);

const useActAuth = () => useContext(AuthContext);

export {
  useGlobalContext,
  GlobalContextProvider,
  useSettings,
  SettingsProvider,
  KeycloakProvider,
  useActAuth,
  useEnvironment,
  EnvironmentProvider,
  useSync,
  SyncProvider
};
