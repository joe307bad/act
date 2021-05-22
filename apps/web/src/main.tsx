import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { getDatabase } from './app/database';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';

const database = getDatabase();

ReactDOM.render(
  <DatabaseProvider database={database}>
    <App />
  </DatabaseProvider>,
  document.getElementById('app')
);
