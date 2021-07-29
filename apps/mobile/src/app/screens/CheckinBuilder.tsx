import {
  Achievement,
  AchievementCategory,
  User
} from '@act/data/core';
import db, { useActAuth } from '@act/data/rn';
import Selector from '../shared/components/Selector';
import { ScreenContainer } from '../../../re/Index.bs';
import React, { FC } from 'react';
import { groupBy, toPairs } from 'lodash';
import { ScrollView } from 'react-native';
import { Stack } from '@mobily/stacks';

const CheckinBuilder: FC = () => {
  const users = db.useCollection<User>('users');
  const achievements = db.useCollection<Achievement>('achievements', [
    'name',
    'category_id'
  ]);
  const categories = db.useCollection<AchievementCategory>(
    'achievement_categories',
    ['name']
  );
  const achievementsByCategory = toPairs(
    groupBy(achievements, 'category_id')
  );
  const { currentUser } = useActAuth();
  const defaultSelectedUser = currentUser
    ? new Map([
        [
          currentUser.id,
          { display: currentUser.username, id: currentUser.id }
        ]
      ])
    : undefined;

  achievementsByCategory.push(['All', achievements]);

  return (
    <ScreenContainer.make>
      <ScrollView>
        <Stack space={2}>
          <Selector<Achievement, AchievementCategory>
            data={achievements}
            categories={categories}
            single="Achievement"
            plural="Achievements"
            icon="checkbox-multiple-marked-circle-outline"
            optionTitleProperty="name"
            title="Checkin Achievements"
            subtitle="Select one or more achievements to checkin"
            fullHeight={true}
            showCountDropdown={true}
            showPointCount={true}
            selectable={true}
            showInfoButton={true}
            onInfoButtonPress={() => {}}
          />
          {currentUser?.admin && (
            <Selector<User>
              data={users}
              defaultSelected={defaultSelectedUser}
              single="User"
              plural="Users"
              icon="account-box-multiple-outline"
              optionTitleProperty="fullName"
              optionSubtitleProperty="username"
              title="Checkin Users"
              subtitle="Select one or more users to checkin"
              inlineTags={true}
            />
          )}
        </Stack>
      </ScrollView>
    </ScreenContainer.make>
  );
};

export default CheckinBuilder;
