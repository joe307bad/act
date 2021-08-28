import React, { FC, useState } from 'react';
import { Text } from 'react-native';
import Modal from '../shared/components/Modal';
import { Rows, Row } from '@mobily/stacks';
import { Achievement } from '@act/data/core';
import { TextInput } from 'react-native-paper';
import { getDefaultFont } from '../core/getDefaultFont';

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
  const { name, description, points } = achievement;
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
