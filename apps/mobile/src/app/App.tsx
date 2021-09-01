import React from 'react';
import { Root } from '../../re/Index.bs';
import {
  KeycloakProvider,
  SyncProvider,
  EnvironmentProvider
} from '@act/data/rn';
import Bugsnag from '@bugsnag/react-native';
import Config from 'react-native-config';
import { GlobalContextProvider } from './core/providers/GlobalContextProvider';
import { StacksProvider } from '@mobily/stacks';
import { configureFonts, Provider } from 'react-native-paper';

if (Config.ENABLE_BUGSNAG) {
  Bugsnag.start();
}

var fontFamily = 'Bebas-Regular';
var fonts = configureFonts({
  default: {
    regular: {
      fontFamily: fontFamily,
      fontWeight: 'normal'
    },
    thin: {
      fontFamily: fontFamily,
      fontWeight: 'normal'
    },
    medium: {
      fontFamily: fontFamily,
      fontWeight: 'normal'
    },
    light: {
      fontFamily: fontFamily,
      fontWeight: 'normal'
    }
  },
  ios: {
    regular: {
      fontFamily: fontFamily,
      fontWeight: 'normal'
    },
    thin: {
      fontFamily: fontFamily,
      fontWeight: 'normal'
    },
    medium: {
      fontFamily: fontFamily,
      fontWeight: 'normal'
    },
    light: {
      fontFamily: fontFamily,
      fontWeight: 'normal'
    }
  },
  android: {
    regular: {
      fontFamily: fontFamily,
      fontWeight: 'normal'
    },
    thin: {
      fontFamily: fontFamily,
      fontWeight: 'normal'
    },
    medium: {
      fontFamily: fontFamily,
      fontWeight: 'normal'
    },
    light: {
      fontFamily: fontFamily,
      fontWeight: 'normal'
    }
  }
});
var animation = {
  scale: 1
};
var colors = {
  primary: '#470FF4',
  accent: '#87FF65',
  background: '#eae8ff',
  surface: 'white',
  error: '#c83e4d',
  text: 'black',
  disabled: '#adacb5',
  placeholder: '#470FF4',
  backdrop: 'rgba(0, 0, 0, 0.33)'
};

var theme = {
  roundness: 0,
  dark: false,
  colors: colors,
  fonts: fonts,
  animation: animation
};

export default () => (
  <StacksProvider debug={false}>
    <Provider theme={theme}>
      <EnvironmentProvider>
        <SyncProvider>
          <GlobalContextProvider>
            <KeycloakProvider>
              <Root.make />
            </KeycloakProvider>
          </GlobalContextProvider>
        </SyncProvider>
      </EnvironmentProvider>
    </Provider>
  </StacksProvider>
);
