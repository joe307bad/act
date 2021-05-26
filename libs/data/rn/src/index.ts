import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { registryFactory, schemaAndMigrations } from '@act/data/core';

export default registryFactory(
  new SQLiteAdapter(schemaAndMigrations)
);
