import 'reflect-metadata';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { registryFactory, schemaAndMigrations } from '@act/data/core';
import * as rnaa from 'react-native-app-auth';

const authConfig = {
  issuer: 'http://192.168.0.4:8080/auth/realms/master',
  clientId: 'account',
  redirectUrl: 'io.act.auth:/oauthredirect',
  dangerouslyAllowInsecureHttpRequests: true,
  additionalParameters: {},
  scopes: ['openid', 'profile']
};

const authorize = () => rnaa.authorize(authConfig);

export default registryFactory(
  new SQLiteAdapter(schemaAndMigrations)
);

export { authorize };
