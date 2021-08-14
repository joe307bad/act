import React, { useEffect, useState } from 'react';
import Modal from '../shared/components/Modal';
import { Headline, Surface, Title } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import json from './SuccessLottieJson.json';
import { Animated, Easing, Text, View } from 'react-native';
import { Rows, Row, Column, Columns, Box } from '@mobily/stacks';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { format } from 'date-fns';

export const CheckinSuccess = ({
  visible,
  onDismiss,
  points,
  numberOfAchievements,
  timestamp,
  note = undefined,
  userCount
}) => {
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
  }, [visible]);

  return (
    <Modal
      dismissText="Reset"
      onDismiss={onDismiss}
      visible={visible}
    >
      <Rows>
        <Row>
          <View style={{ height: heightPercentageToDP(10) }}>
            <LottieView
              style={{
                marginTop: heightPercentageToDP(-1),
                marginBottom: heightPercentageToDP(-3),
                alignSelf: 'center'
              }}
              source={json}
              progress={progress}
            />
          </View>
        </Row>
        <Row paddingTop={5}>
          <Headline style={{ fontSize: 30, textAlign: 'center' }}>
            Checkin Successful!
          </Headline>
        </Row>
        <Row>
          <Columns>
            <Column>
              <Title style={{ alignSelf: 'center' }}>
                {points.toLocaleString()}{' '}
                {`point${points > 1 || points === 0 ? 's' : ''}`}
              </Title>
            </Column>
            <Column>
              <Title
                numberOfLines={1}
                style={{ alignSelf: 'center' }}
              >
                {numberOfAchievements}{' '}
                {`achievement${
                  numberOfAchievements > 1 ||
                  numberOfAchievements === 0
                    ? 's'
                    : ''
                }`}
              </Title>
            </Column>
            <Column>
              <Title style={{ alignSelf: 'center' }}>
                {userCount}{' '}
                {`user${userCount > 1 || userCount === 0 ? 's' : ''}`}
              </Title>
            </Column>
          </Columns>
        </Row>
        <Row paddingBottom={note ? 0 : 5}>
          <Headline style={{ fontSize: 30, textAlign: 'center' }}>
            {timestamp && format(timestamp, 'EEE MMM do @ pp')}
          </Headline>
        </Row>
        {note !== '' && note && (
          <Row paddingBottom={6}>
            <Surface style={{ elevation: 2 }}>
              <Box padding={5}>
                <Text>{note}</Text>
              </Box>
            </Surface>
          </Row>
        )}
      </Rows>
    </Modal>
  );
};
