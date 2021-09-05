import React, { FC, useEffect, useState } from 'react';
import { Text } from 'react-native';
import Modal from '../shared/components/Modal';
import { Rows, Row } from '@mobily/stacks';
import { Achievement } from '@act/data/core';
import { TextInput } from 'react-native-paper';
import { getDefaultFont } from '../core/getDefaultFont';
import Config from 'react-native-config';
import { sample } from 'lodash';

export const SingleCheckin: FC<{
  achievement?: Achievement;
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (note: string) => void;
  disableSubmit?: boolean;
  note?: string;
  setNote?: (note: string) => void;
}> = ({
  achievement = {},
  visible,
  onConfirm,
  onDismiss,
  disableSubmit,
  note,
  setNote
}) => {
  const { name, description, points, enabled, photo } = achievement;
  useEffect(() => {
    if (visible && Config.RANDOM_CHECKIN_NOTE && achievement.name) {
      setNote(sample(Config.RANDOM_CHECKIN_NOTE.split('|')));
    }
  }, [achievement]);
  return (
    <Modal
      title={name}
      showPointCount={true}
      pointsCount={points}
      dismissText="Cancel"
      showEntireHeadline={true}
      disableSubmit={disableSubmit}
      onDismiss={() => {
        onDismiss();
        setNote('');
      }}
      visible={visible}
      apply={enabled ? () => onConfirm(note) : undefined}
      applyText="Confirm"
      thumbnail={photo}
    >
      <Rows>
        <Row paddingBottom={5}>
          <Text>{description}</Text>
        </Row>
        <Row paddingBottom={5}>
          <TextInput
            textAlign="left"
            label="Checkin Note"
            value={note}
            theme={{
              fonts: {
                regular: {
                  fontFamily: getDefaultFont()
                }
              }
            }}
            mode="outlined"
            onChangeText={setNote}
          />
        </Row>
      </Rows>
    </Modal>
  );
};
