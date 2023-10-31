import { Column, Columns, FillView, Row, Rows } from '@mobily/stacks';
import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { Text, Image } from 'react-native';
import {
  Modal as PaperModal,
  Portal,
  Card,
  Searchbar,
  Title,
  TouchableRipple,
  Headline
} from 'react-native-paper';
import { AwesomeButtonMedium } from '../../AwesomeButton';
import Chip from './Chip';
import Config from 'react-native-config';

const CardActions = ({
  apply,
  onDismiss,
  dismissText = undefined,
  applyText = undefined,
  disableSubmit = undefined
}) => {
  return (
    <Card.Actions>
      <Columns space={2}>
        {apply && (
          <Column>
            <AwesomeButtonMedium
              onPress={apply}
              disabled={disableSubmit}
            >
              {applyText || 'Apply'}
            </AwesomeButtonMedium>
          </Column>
        )}
        <Column>
          <AwesomeButtonMedium type="outlined" onPress={onDismiss}>
            {dismissText || 'Cancel'}
          </AwesomeButtonMedium>
        </Column>
      </Columns>
    </Card.Actions>
  );
};

type ModalProps = {
  visible: boolean;
  apply?: () => void;
  onDismiss: () => void;
  title?: string;
  subtitle?: string;
  fullHeight?: boolean;
  showPointCount?: boolean;
  pointsCount?: number;
  showSearchBar?: boolean;
  searchCriteria?: string;
  onSearchChange?: React.Dispatch<React.SetStateAction<string>>;
  selectedItemDescription?: string;
  selectedItemTitle?: string;
  closeSelectedItemInfo?: () => void;
  dismissText?: string;
  applyText?: string;
  showEntireHeadline?: boolean;
  disableSubmit?: boolean;
  thumbnail?: string;
  children: JSX.Element | JSX.Element[];
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
  closeSelectedItemInfo,
  dismissText,
  applyText,
  showEntireHeadline,
  disableSubmit,
  thumbnail
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
                {title && (
                  <Row height="content">
                    <Columns alignY="center" paddingRight={5}>
                      <Column>
                        <Card.Title
                          title={title}
                          subtitle={subtitle}
                        />
                      </Column>
                      {showPointCount && (
                        <Column width="content">
                          <Chip
                            title={pointsCount.toLocaleString()}
                          />
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
                )}
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
                  <CardActions
                    apply={apply}
                    onDismiss={onDismiss}
                    dismissText={dismissText}
                  />
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
            {title && (
              <Columns alignY="center" padding={2} space={2}>
                <Column
                  paddingLeft={thumbnail ? 0 : 2}
                  paddingTop={showEntireHeadline ? 2 : 0}
                >
                  <Columns alignX="center" alignY="center" space={2}>
                    {!isEmpty(thumbnail) && (
                      <Column width="content">
                        <Image
                          source={{
                            uri: `${Config.THUMBNAIL_URL}/${thumbnail}`
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 50 / 2
                          }}
                        />
                      </Column>
                    )}
                    <Column>
                      <Headline>{title}</Headline>
                    </Column>
                  </Columns>
                </Column>
                {showPointCount && (
                  <Column width="content">
                    <Chip title={pointsCount.toLocaleString()} />
                  </Column>
                )}
              </Columns>
            )}
            <Rows>
              <Row>
                <Card.Content>{children}</Card.Content>
              </Row>
              <Row height="content">
                <CardActions
                  disableSubmit={disableSubmit}
                  applyText={applyText}
                  dismissText={dismissText}
                  apply={apply}
                  onDismiss={onDismiss}
                />
              </Row>
            </Rows>
          </Card>
        </PaperModal>
      )}
    </Portal>
  );
};

export default Modal;
