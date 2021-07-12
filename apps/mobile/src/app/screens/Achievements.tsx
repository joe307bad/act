import React, { FC } from 'react';
import db from '@act/data/rn';
import { Achievement, AchievementCategory } from '@act/data/core';
import { TabbedList } from '../shared/components/TabbedList';

const Achievements: FC = () => {
  const achievements = db.useCollection<Achievement>('achievements', [
    'name',
    'category_id'
  ]);
  const categories = db.useCollection<AchievementCategory>(
    'achievement_categories',
    ['name']
  );

  return (
    <TabbedList<Achievement, AchievementCategory>
      data={achievements}
      categories={categories}
      optionTitleProperty={'name'}
    />
  );
};

export default Achievements;
