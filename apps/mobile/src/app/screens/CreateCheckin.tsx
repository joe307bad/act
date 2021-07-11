import {
  Achievement,
  AchievementCategory,
  User
} from '@act/data/core';
import db from '@act/data/rn';
import Selector from '../shared/components/Selector';
import { ScreenContainer } from '../../../re/Index.bs';
import React, { FC } from 'react';
import { groupBy, toPairs } from 'lodash';

const CreateCheckin: FC = () => {
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

  achievementsByCategory.push(['All', achievements]);
  return (
    <ScreenContainer.make>
      <Selector<Achievement, AchievementCategory>
        data={achievementsByCategory}
        categories={categories}
        single="Achievement"
        plural="Achievements"
        icon="account-box-multiple-outline"
        optionTitleProperty="name"
        title="Checkin Achievements"
        subtitle="Select one or more achievements to checkin"
        fullHeight={true}
        selectable={true}
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
        selectable={true}
      />
    </ScreenContainer.make>
  );
};

export default CreateCheckin;
