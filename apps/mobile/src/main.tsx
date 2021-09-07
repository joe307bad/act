import 'react-native-gesture-handler';
import 'reflect-metadata';
import { AppRegistry } from 'react-native';
import App from './app/App';
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  console.log('wdyrr');
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true
  });
}
AppRegistry.registerComponent('main', () => App);
