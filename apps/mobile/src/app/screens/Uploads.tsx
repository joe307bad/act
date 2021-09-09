import { Headline, TouchableRipple } from 'react-native-paper';
import React, { useState } from 'react';
import { useGlobalContext } from '@act/data/rn';
import FastImage from 'react-native-fast-image';
import { Box, Column, Columns, Tiles } from '@mobily/stacks';
import Config from 'react-native-config';
import { FlatList, Text } from 'react-native';
import { chunk } from 'lodash';
import Modal from '../shared/components/Modal';

const renderItem = ({ item, index }, setSelectedPhoto) => {
  const thumbnailUrl = (name) =>
    `${Config.CLOUDINARY_THUMBNAIL_URL}/${name}`;
  return (
    <Columns
      paddingBottom={2}
      paddingTop={index === 0 ? 2 : 0}
      space={2}
      paddingX={2}
    >
      {item.map((i) => (
        <Column key={i}>
          <TouchableRipple onPress={() => setSelectedPhoto(i)}>
            <Box alignX="center" style={{ overflow: 'hidden' }}>
              <FastImage
                style={{ width: 200, height: 200 }}
                source={{
                  uri: thumbnailUrl(i),
                  priority: FastImage.priority.normal
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </Box>
          </TouchableRipple>
        </Column>
      ))}
    </Columns>
  );
};

export const Uploads = () => {
  const { uploads } = useGlobalContext();
  const [selectedPhoto, setSelectedPhoto] = useState<string>();

  return (
    <>
      <FlatList
        renderItem={(i) => renderItem(i, setSelectedPhoto)}
        keyExtractor={(i) => i[0]}
        data={chunk(uploads, 3)}
      />
      <Modal
        visible={!!selectedPhoto}
        onDismiss={() => setSelectedPhoto(undefined)}
        fullHeight={true}
        dismissText="Dismiss"
      >
        {selectedPhoto && (
          <FastImage
            style={{ width: '100%', height: '100%' }}
            source={{
              uri: (() => {
                console.log(
                  `${Config.CLOUDINARY_FULL_SIZE_URL}/${selectedPhoto}`
                );
                return `${Config.CLOUDINARY_FULL_SIZE_URL}/${selectedPhoto}`;
              })(),
              priority: FastImage.priority.normal
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
      </Modal>
    </>
  );
};
