import React, { FC, useState } from 'react';
import { Text } from 'react-native';
import Modal from '../shared/components/Modal';
import { Rows, Row } from '@mobily/stacks';
import { Achievement } from '@act/data/core';
import { TextInput } from 'react-native-paper';

export const SingleCheckin: FC<{
  achievement?: Achievement;
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (note: string) => void;
}> = ({ achievement = {}, visible, onConfirm, onDismiss }) => {
  const { name, description, points } = achievement;
  const [note, setNote] = useState('');
  return (
    <Modal
      title={name}
      showPointCount={true}
      pointsCount={points}
      dismissText="Cancel"
      showEntireHeadline={true}
      onDismiss={() => {
        onDismiss();
        setNote('');
      }}
      visible={visible}
      apply={() => onConfirm(note)}
      applyText="Confirm"
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
            mode="outlined"
            theme={{
              fonts: {
                regular: {
                  fontFamily: 'sans-serif'
                }
              }
            }}
            onChangeText={setNote}
          />
        </Row>
      </Rows>
    </Modal>
  );
};
