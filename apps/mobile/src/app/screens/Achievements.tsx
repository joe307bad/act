import React, { FC } from 'react';
import { Headline, List } from 'react-native-paper';
import { Tabs, TabScreen } from 'react-native-paper-tabs';
import db from '@act/data/rn';
import { Achievement, AchievementCategory } from '@act/data/core';
import { groupBy, toPairs } from 'lodash';

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
  console.log({ achievementsByCategory });

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
                <List.Item
                  titleStyle={{ fontSize: 20 }}
                  key={achievement.id}
                  title={achievement.name}
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
