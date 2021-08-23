import React from 'react';
import { Headline } from 'react-native-paper';

export const Component2 = ({ navigation }) => {
  return (
    <Headline
      onPress={() =>
        navigation.navigate('Entry', { screen: 'Component1' })
      }
    >
      Component 2
    </Headline>
  );
};
