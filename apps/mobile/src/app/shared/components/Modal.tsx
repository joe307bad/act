import React, { FC } from 'react';
import {
  Modal as PaperModal,
  Portal,
  Card
} from 'react-native-paper';
import { AwesomeButtonMedium } from '../../AwesomeButton';

type ModalProps = {
  visible: boolean;
  apply: () => void;
  onDismiss: () => void;
  title: string;
  subtitle: string;
};
const Modal: FC<ModalProps> = ({
  visible,
  children,
  apply,
  onDismiss,
  title,
  subtitle
}) => (
  <Portal>
    <PaperModal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={{
        position: 'absolute',
        width: '100%',
        bottom: 0
      }}
    >
      <Card style={{ margin: 10 }}>
        <Card.Title title={title} subtitle={subtitle} />
        <Card.Content>{children}</Card.Content>
        <Card.Actions>
          <AwesomeButtonMedium onPress={apply}>
            Apply
          </AwesomeButtonMedium>
        </Card.Actions>
      </Card>
    </PaperModal>
  </Portal>
);

export default Modal;
