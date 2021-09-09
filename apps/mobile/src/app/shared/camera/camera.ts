import * as ImagePicker from 'react-native-image-picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import Config from 'react-native-config';
import db, { useSync } from '@act/data/rn';
import Bugsnag from '@bugsnag/react-native';

export const launchCamera = async (sync) => {
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

      db.models.uploads
        .insert({
          name,
          type,
          uri
        })
        .then(() => sync())
        .catch((err) =>
          Bugsnag.notify(new Error(`Upload failed ${err.toString()}`))
        );
    }
  });
};

export const launchImageLibrary = async (sync) => {
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

  ImagePicker.launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else {
      const uri = response.assets[0].uri;
      const type = response.assets[0].type;
      const name = response.assets[0].fileName;

      db.models.uploads
        .insert({
          name,
          type,
          uri
        })
        .then(() => sync())
        .catch((err) =>
          Bugsnag.notify(new Error(`Upload failed ${err.toString()}`))
        );
    }
  });
};
