import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { db } from '@act/data/web';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';

ReactDOM.render(
  <DatabaseProvider database={db.get}>
    <App />
  </DatabaseProvider>,
  document.getElementById('app')
);
