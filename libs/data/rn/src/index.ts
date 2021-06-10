import 'reflect-metadata';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { registryFactory, schemaAndMigrations } from '@act/data/core';
import KeycloakProvider from '@act/data/rn';

export default registryFactory(
  new SQLiteAdapter(schemaAndMigrations)
);

export { KeycloakProvider };
