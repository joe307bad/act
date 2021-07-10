import React, { FC } from 'react';
import {
  Checkbox,
  Headline,
  List,
  useTheme
} from 'react-native-paper';
import { Tabs, TabScreen } from 'react-native-paper-tabs';
import db from '@act/data/rn';
import { Achievement, AchievementCategory } from '@act/data/core';
import { groupBy, toPairs } from 'lodash';
import { View } from 'react-native';
import { Option } from '../shared/components/Selector';

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
    <Tabs>
      {achievementsByCategory.map((category) => {
        const label = (() => {
          if (category[0] === 'null') {
            return 'No Category';
          }

          if (category[0] === 'All') {
            return 'All';
          }

          return categories.find((c) => c.id === category[0]).name;
        })();
        return (
          <TabScreen key={category[0]} label={label}>
            <>
              {category[1].map((achievement) => (
                <Option
                  initialValue={false}
                  onChange={() => {}}
                  title={achievement.name}
                  value={achievement.id}
                  key={achievement.id}
                />
              ))}
            </>
          </TabScreen>
        );
      })}
    </Tabs>
  );
};

export default Achievements;
