import { Box } from '@mobily/stacks';
import React from 'react';
import { View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import logo from './logo-svg';

export default () => {
  return (
    <Box flex="fluid" alignX="center" alignY="center">
      <View
        style={{ height: heightPercentageToDP(20), width: '100%' }}
      >
        <SvgXml xml={logo} />
      </View>
    </Box>
  );
};
