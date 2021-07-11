import React, { FC } from 'react';
import db from '@act/data/rn';
import { Achievement, AchievementCategory } from '@act/data/core';
import { groupBy, toPairs } from 'lodash';
import { TabbedSelector } from '../shared/components/TabbedSelector';

const Achievements: FC = () => {
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

  if (achievements.length === 0 || categories.length === 0) {
    return <></>;
  }

  return (
    <TabbedSelector<Achievement, AchievementCategory>
      data={achievementsByCategory}
      categories={categories}
      optionTitleProperty={'name'}
      selectable={false}
    />
  );
};

export default Achievements;
