import { useKeycloak } from '@react-keycloak/native';
import React from 'react';
import { Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActAuth } from '@act/data/rn';

const CreateCheckin = () => {
  const { keycloak, initialized } = useKeycloak();
  const { setForceLogout } = useActAuth();
  return (
    <>
      <Text>HGey there</Text>
      <Button
        onPress={() => {
          setForceLogout(true);
          AsyncStorage.removeItem('currentUserId');
          keycloak.logout();
        }}
        title="Logout"
      />
    </>
  );
};

export default CreateCheckin;
