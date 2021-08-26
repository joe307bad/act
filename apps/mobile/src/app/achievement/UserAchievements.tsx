import React, { FC, useEffect, useState } from 'react';
import Modal from '../shared/components/Modal';
import { TabbedList } from '../shared/components/TabbedList';
import db from '@act/data/rn';
import { Achievement, AchievementCategory } from '@act/data/core';
import { Rows, Row, Box } from '@mobily/stacks';
import { AchievementRowLite } from './AchievementRowLite';
import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { Dropdown } from '../shared/components/Dropdown';
import { useGlobalContext } from '../core/providers/GlobalContextProvder';

const UserAchievementsTabbedList: FC<{
  achievements: Achievement[];
  categories: AchievementCategory[];
  userAchievements: Map<string, number>;
  setSelectedInfo: (title: string, description: string) => void;
}> = ({ achievements, categories, setSelectedInfo }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <Rows>
      <Row height="content">
        <Surface style={{ elevation: 2 }}>
          <Dropdown
            fullWidth
            value={selectedCategory}
            onValueChange={(v) => setSelectedCategory(v)}
            items={categories.map((c) => ({
              label: c.name,
              value: c.id
            }))}
            padding={3}
          />
        </Surface>
      </Row>
      <Row>
        <Box padding={2} paddingBottom={0} paddingTop={0}>
          {achievements && (
            <FlatList
              data={achievements}
              renderItem={({ item }) => (
                <AchievementRowLite
                  item={item}
                  fixedCount={item.fixedCount}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </Box>
      </Row>
    </Rows>
  );
};

export const UserAchievements: FC<{
  checkins: Set<string>;
  userCheckins: Map<string, Set<string>>;
  checkinAchievements: Map<string, Map<string, number>>;
  totalPoints?: number;
  userId?: string;
  name?: string;
  onDismiss: () => void;
  visible?: boolean;
}> = ({
  checkins,
  userCheckins,
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

  const { achievementsByCategory, categoriesById } =
    useGlobalContext();
  const achievementsById = achievementsByCategory.get('all');
  const achievements = Array.from(userAchievements).map(
    ([achievementId, count]) => {
      return {
        ...achievementsById.get(achievementId),
        fixedCount: count,
        id: achievementId
      };
    }
  );

  const categories = Array.from(categoriesById.values()).map((c) => ({
    id: c.id,
    name: c.name
  }));

  useEffect(() => {
    const checkinsForUser = userCheckins.get(userId);
    if (visible && checkinsForUser) {
      setUserAchievements(
        Array.from(checkinsForUser).reduce((acc, checkinId) => {
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
        }, new Map())
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
