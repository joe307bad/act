import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { registryFactory, schemaAndMigrations } from '@act/data/core';

export const db = registryFactory(
  new SQLiteAdapter(schemaAndMigrations)
);
