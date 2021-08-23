import React from 'react';
import { Headline } from 'react-native-paper';

export const Component1 = ({ navigation }) => {
  return (
    <Headline
      onPress={() =>
        navigation.navigate('Entry', { screen: 'Component2' })
      }
    >
      Component 1
    </Headline>
  );
};
