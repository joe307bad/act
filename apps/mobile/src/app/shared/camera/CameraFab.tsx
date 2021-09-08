import { FAB, useTheme } from 'react-native-paper';
import React from 'react';
import * as ImagePicker from 'react-native-image-picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import Config from 'react-native-config';
import db from '@act/data/rn';

const selectPhotoTapped = async () => {
  const options = {
    title: 'Select Photo',
    mediaType: 'photo' as ImagePicker.MediaType,
    saveToPhotos: true,
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };

  await request(PERMISSIONS.ANDROID.CAMERA);

  ImagePicker.launchCamera(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else {
      const uri = response.assets[0].uri;
      const type = response.assets[0].type;
      const name = response.assets[0].fileName;

      db.models.uploads.insert({
        name,
        type,
        uri
      });
    }
  });
};
export const CameraFab = () => {
  const theme = useTheme();
  return (
    <FAB
      style={{
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.primary
      }}
      color={'white'}
      icon="camera"
      onPress={selectPhotoTapped}
    />
  );
};
