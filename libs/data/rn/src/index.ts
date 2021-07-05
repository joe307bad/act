import 'reflect-metadata';
import { useContext } from 'react';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { registryFactory, schemaAndMigrations } from '@act/data/core';
import KeycloakProvider, { AuthContext } from './KeycloakProvider';
import usePromise from 'react-use-promise';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default registryFactory(
  new SQLiteAdapter(schemaAndMigrations)
);

const useActAuth = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};

const useCurrentUserId = () => {
  const [result, error, state] = usePromise(
    async () => AsyncStorage.getItem('currentUserId'),
    []
  );
  return { result, error, state };
};

export { KeycloakProvider, useActAuth, useCurrentUserId };
