import React, { FC, useState } from 'react';
import {
  Achievement,
  AchievementCategory,
  CreateCheckin
} from '@act/data/core';
import { TabbedList } from '../shared/components/TabbedList';
import { SingleCheckin } from '../checkin/SingleCheckin';
import db, { useActAuth } from '@act/data/rn';
import { CheckinSuccess } from '../checkin/CheckinSuccess';

const Achievements: FC = () => {
  const achievements = db.useCollection<Achievement>('achievements', [
    'name',
    'category_id'
  ]);
  const categories = db.useCollection<AchievementCategory>(
    'achievement_categories',
    ['name']
  );

  const { currentUser } = useActAuth();
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement>();
  const [confirmedCheckin, setConfirmedCheckin] =
    useState<CreateCheckin>();

  return (
    <>
      <TabbedList<Achievement, AchievementCategory>
        data={achievements}
        categories={categories}
        optionTitleProperty={'name'}
        onOptionSelect={(achievement) =>
          setSelectedAchievement(achievement)
        }
      />
      <SingleCheckin
        visible={!!selectedAchievement && !confirmedCheckin}
        achievement={selectedAchievement}
        onConfirm={async (note: string) => {
          const checkin: CreateCheckin = {
            achievementCounts: new Map([[selectedAchievement.id, 1]]),
            insertProps: { note },
            isAdmin: currentUser.admin,
            points: selectedAchievement.points,
            users: [currentUser.id]
          };

          const created = await db.models.checkins.create(checkin);
          setConfirmedCheckin({
            ...checkin,
            created
          });
        }}
        onDismiss={() => setSelectedAchievement(undefined)}
      />
      <CheckinSuccess
        visible={!!confirmedCheckin}
        onDismiss={() => {
          setConfirmedCheckin(undefined);
          setSelectedAchievement(undefined);
        }}
        numberOfAchievements={1}
        points={confirmedCheckin?.points || 0}
        timestamp={confirmedCheckin?.created}
        note={confirmedCheckin?.insertProps?.note ?? ''}
        userCount={confirmedCheckin?.users?.length}
        dismissText="Dismiss"
      />
    </>
  );
};

export default Achievements;
