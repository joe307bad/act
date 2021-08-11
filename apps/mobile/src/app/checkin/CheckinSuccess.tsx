import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import Modal from '../shared/components/Modal';
import { useTheme } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import usePromise from 'react-use-promise';
import json from './SuccessLottieJson.json';
import { Animated, Easing } from 'react-native';

export const CheckinSuccess = ({}) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, []);

  return (
    <>
      <Modal
        title={`Confirm Checkin`}
        subtitle={`Confirm this Checkin`}
        apply={() => {}}
        onDismiss={() => {}}
        visible={true}
      >
        <LottieView
          style={{ height: 300, width: 300, alignSelf: 'center' }}
          source={json}
          progress={progress}
        />
      </Modal>
    </>
  );
};
