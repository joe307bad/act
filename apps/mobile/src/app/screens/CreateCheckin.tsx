import { Achievement, User } from '@act/data/core';
import db, { useActAuth } from '@act/data/rn';
import { useKeycloak } from '@react-keycloak/native';
import Selector from '../shared/components/Selector';
import { ScreenContainer } from '../../../re/Index.bs';
import React, { FC } from 'react';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateCheckin: FC = () => {
  const { keycloak } = useKeycloak();
  const { setForceLogout } = useActAuth();
  const users = db.useCollection<User>('users');
  const achievements = db.useCollection<Achievement>('achievements');
  return (
    <ScreenContainer.make>
      <Selector<Achievement>
        data={achievements}
        single="Achievement"
        plural="Achievements"
        icon="account-box-multiple-outline"
        optionTitleProperty="name"
        optionSubtitleProperty="createdAt"
        title="Checkin Achievements"
        subtitle="Select one or more achievements to checkin"
      />
      <Selector<User>
        data={users}
        single="User"
        plural="Users"
        icon="account-box-multiple-outline"
        optionTitleProperty="fullName"
        optionSubtitleProperty="username"
        title="Checkin Users"
        subtitle="Select one or more users to checkin"
      />
      <Button
        onPress={() => {
          setForceLogout(true);
          AsyncStorage.removeItem('currentUserId');
          keycloak.logout();
        }}
      >
        Logout
      </Button>
    </ScreenContainer.make>
  );
};

export default CreateCheckin;
