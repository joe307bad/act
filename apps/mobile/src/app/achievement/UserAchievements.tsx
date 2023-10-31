import React, { FC, useMemo, useState } from 'react';
import Modal from '../shared/components/Modal';
import { Rows, Row, Box } from '@mobily/stacks';
import { AchievementRowLite } from './AchievementRowLite';
import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { Dropdown } from '../shared/components/Dropdown';
import { useGlobalContext } from '@act/data/rn';
import { Achievement } from '@act/data/core';
import * as services from '../shared/services';
import { useAchievements } from '../shared/services';

const UserAchievementsTabbedList: FC<{
  achievements: Achievement[];
  userAchievementCounts: Map<string, number>;
  setSelectedInfo: (title: string, description: string) => void;
}> = ({
  achievements: allAchievements,
  userAchievementCounts,
  setSelectedInfo
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { categoriesById } = useGlobalContext();
  const { getAchievementsByCategory } =
    useAchievements(allAchievements);
  const achievements = useMemo(
    () => getAchievementsByCategory(selectedCategory),
    [selectedCategory]
  );

  return (
    <Rows>
      <Row height="content">
        <Surface style={{ elevation: 2 }}>
          <Dropdown
            fullWidth
            value={selectedCategory}
            onValueChange={(v) => setSelectedCategory(v)}
            items={Array.from(categoriesById.values()).map((c) => ({
              label: c.name,
              value: c.id
            }))}
            padding={3}
          />
        </Surface>
      </Row>
      <Row>
        <Box padding={2} paddingBottom={0} paddingTop={0}>
          {achievements.length > 0 && (
            <FlatList
              data={achievements.filter((a) =>
                userAchievementCounts.has(a.id)
              )}
              renderItem={({ item }) => {
                const { id, name, description } = item;
                return (
                  <AchievementRowLite
                    item={item}
                    fixedCount={userAchievementCounts.get(id)}
                    onPress={() => setSelectedInfo(name, description)}
                  />
                );
              }}
              keyExtractor={({ id }) => id}
            />
          )}
        </Box>
      </Row>
    </Rows>
  );
};

export const UserAchievementsComponent: FC<{
  achievements: Achievement[];
  userAchievementCounts: Map<string, number>;
  totalPoints?: number;
  userId?: string;
  onDismiss: () => void;
  visible?: boolean;
}> = ({
  achievements,
  userAchievementCounts,
  totalPoints,
  userId,
  onDismiss,
  visible
}) => {
  const { fullNamesByUser } = useGlobalContext();
  const [selectedInfo, setSelectedInfo] = useState<{
    name?: string;
    description?: string;
  }>({});

  return (
    <Modal
      fullHeight
      title={`${fullNamesByUser.get(userId)}'s Achievements`}
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
          achievements={achievements}
          userAchievementCounts={userAchievementCounts}
          setSelectedInfo={(title, description) =>
            setSelectedInfo({ name: title, description })
          }
        />
      )}
    </Modal>
  );
};

export const UserAchievements = services.withAchievements(
  UserAchievementsComponent
);
