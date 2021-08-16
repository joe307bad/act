import React, { FC, useEffect, useState } from 'react';
import Modal from '../shared/components/Modal';
import { TabbedList } from '../shared/components/TabbedList';
import db from '@act/data/rn';
import { Achievement, AchievementCategory } from '@act/data/core';
import withObservables from '@nozbe/with-observables';

const UserAchievementsTabbedList: FC<{
  achievementsById: Map<
    string,
    {
      points: number;
      name: string;
      description: string;
      category_id: string;
    }
  >;
  userAchievements: Map<string, number>;
  setSelectedInfo: (title: string, description: string) => void;
}> = ({ achievementsById, userAchievements, setSelectedInfo }) => {
  const achievements = Array.from(userAchievements).map(
    ([achievementId, count]) => {
      return {
        ...achievementsById.get(achievementId),
        fixedCount: count,
        id: achievementId
      };
    }
  );
  const categories = db.useCollection<AchievementCategory>(
    'achievement_categories',
    ['name']
  );
  return (
    <TabbedList<Achievement, AchievementCategory>
      data={achievements}
      categories={categories}
      selectable={false}
      optionTitleProperty={'name'}
      showInfoButton
      setSelectedInfo={setSelectedInfo}
    />
  );
};

export const UserAchievements: FC<{
  checkins: Set<string>;
  userCheckins: Map<string, Set<string>>;
  achievementsById: Map<
    string,
    {
      points: number;
      name: string;
      category_id: string;
      description: string;
    }
  >;
  checkinAchievements: Map<string, Map<string, number>>;
  totalPoints?: number;
  userId?: string;
  name?: string;
  onDismiss: () => void;
  visible?: boolean;
}> = ({
  checkins,
  userCheckins,
  achievementsById,
  checkinAchievements,
  totalPoints,
  userId,
  name,
  onDismiss,
  visible
}) => {
  const [userAchievements, setUserAchievements] = useState<
    Map<string, number>
  >(new Map());
  const [selectedInfo, setSelectedInfo] = useState<{
    name?: string;
    description?: string;
  }>({});
  useEffect(() => {
    if (visible) {
      setUserAchievements(
        Array.from(userCheckins.get(userId)).reduce(
          (acc, checkinId) => {
            if (!checkins?.has(checkinId)) {
              return acc;
            }
            const achievements = checkinAchievements.get(checkinId);
            achievements &&
              Array.from(achievements).forEach(
                ([achievementId, count]) => {
                  const exists = acc.get(achievementId);
                  if (exists) {
                    acc.set(achievementId, exists + count);
                  } else {
                    acc.set(achievementId, count);
                  }
                }
              );
            return acc;
          },
          new Map()
        )
      );
    }
  }, [visible]);
  return (
    <Modal
      fullHeight
      title={`${name}'s Achievements`}
      onDismiss={onDismiss}
      visible={visible}
      showPointCount
      pointsCount={totalPoints}
      dismissText="Dismiss"
      selectedItemTitle={selectedInfo.name}
      selectedItemDescription={selectedInfo.description}
      closeSelectedItemInfo={() => setSelectedInfo({})}
    >
      {userId && (
        <UserAchievementsTabbedList
          achievementsById={achievementsById}
          userAchievements={userAchievements}
          setSelectedInfo={(title, description) =>
            setSelectedInfo({ name: title, description })
          }
        />
      )}
    </Modal>
  );
};
