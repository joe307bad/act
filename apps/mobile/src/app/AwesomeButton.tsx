import React from 'react';
import ReallyAwesomeButton from 'react-native-really-awesome-button';
import { Headline } from 'react-native-paper';

const AwesomeButton = ({ children }) => {
  return (
    <ReallyAwesomeButton
      stretch
      backgroundColor="#470FF4"
      backgroundDarker="#3809C3"
    >
      <Headline style={{ color: 'white' }}>{children}</Headline>
    </ReallyAwesomeButton>
  );
};

export default AwesomeButton;
