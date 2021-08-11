import { Column, Columns, FillView, Row, Rows } from '@mobily/stacks';
import React, { FC, useEffect, useRef } from 'react';
import { Text } from 'react-native';
import {
  Modal as PaperModal,
  Portal,
  Card,
  Searchbar,
  Title,
  TouchableRipple
} from 'react-native-paper';
import { AwesomeButtonMedium } from '../../AwesomeButton';
import Chip from './Chip';
import Confetti from 'react-native-confetti';

const CardActions = ({ apply, onDismiss }) => {
  return (
    <Card.Actions>
      <Columns space={2}>
        <Column>
          <AwesomeButtonMedium onPress={apply}>
            Apply
          </AwesomeButtonMedium>
        </Column>
        <Column>
          <AwesomeButtonMedium type="outlined" onPress={onDismiss}>
            Cancel
          </AwesomeButtonMedium>
        </Column>
      </Columns>
    </Card.Actions>
  );
};

type ModalProps = {
  visible: boolean;
  apply: () => void;
  onDismiss: () => void;
  title: string;
  subtitle: string;
  fullHeight?: boolean;
  showPointCount?: boolean;
  pointsCount?: number;
  showSearchBar?: boolean;
  searchCriteria?: string;
  onSearchChange?: React.Dispatch<React.SetStateAction<string>>;
  selectedItemDescription?: string;
  selectedItemTitle?: string;
  closeSelectedItemInfo?: () => void;
};
const Modal: FC<ModalProps> = ({
  visible,
  children,
  apply,
  onDismiss,
  title,
  subtitle,
  fullHeight,
  showPointCount,
  pointsCount,
  showSearchBar,
  searchCriteria,
  onSearchChange,
  selectedItemDescription,
  selectedItemTitle,
  closeSelectedItemInfo
}) => {
  return (
    <Portal>
      {fullHeight ? (
        <PaperModal
          visible={visible}
          onDismiss={onDismiss}
          contentContainerStyle={{
            height: '100%'
          }}
        >
          <FillView padding={2}>
            <Card
              style={{
                height: '100%'
              }}
            >
              <Rows>
                <Row height="content">
                  <Columns alignY="center" paddingRight={5}>
                    <Column>
                      <Card.Title title={title} subtitle={subtitle} />
                    </Column>
                    {showPointCount && (
                      <Column width="content">
                        <Chip title={pointsCount.toLocaleString()} />
                      </Column>
                    )}
                  </Columns>
                  {showSearchBar && (
                    <Searchbar
                      textAlign="left"
                      placeholder="Search"
                      onChangeText={onSearchChange}
                      value={searchCriteria}
                    />
                  )}
                </Row>
                <Row>{children}</Row>
                {selectedItemTitle && (
                  <Row
                    height="content"
                    paddingRight={2}
                    paddingLeft={2}
                  >
                    <TouchableRipple onPress={closeSelectedItemInfo}>
                      <>
                        <Title>{selectedItemTitle}</Title>
                        <Text>{selectedItemDescription}</Text>
                      </>
                    </TouchableRipple>
                  </Row>
                )}
                <Row height="content">
                  <CardActions apply={apply} onDismiss={onDismiss} />
                </Row>
              </Rows>
            </Card>
          </FillView>
        </PaperModal>
      ) : (
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
            <CardActions apply={apply} onDismiss={onDismiss} />
          </Card>
        </PaperModal>
      )}
    </Portal>
  );
};

export default Modal;
