import React, { FC, useState } from 'react';
import Modal from '../shared/components/Modal';
import { Rows, Row, Box } from '@mobily/stacks';
import { AchievementRowLite } from './AchievementRowLite';
import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { Dropdown } from '../shared/components/Dropdown';
import { useGlobalContext } from '../core/providers/GlobalContextProvider';

const UserAchievementsTabbedList: FC<{
  userAchievementCounts: Map<string, number>;
  setSelectedInfo: (title: string, description: string) => void;
}> = ({ userAchievementCounts, setSelectedInfo }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { achievementsByCategory, categoriesById } =
    useGlobalContext();
  const achievements = achievementsByCategory?.get(selectedCategory);

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
          {achievements && (
            <FlatList
              data={Array.from(achievements).filter(
                ([achievementId]) =>
                  userAchievementCounts.has(achievementId)
              )}
              renderItem={({ item }) => {
                const [achievementId, count] = item;
                const achievement = achievements.get(achievementId);
                return (
                  <AchievementRowLite
                    item={achievement}
                    fixedCount={userAchievementCounts.get(
                      achievementId
                    )}
                    onPress={() =>
                      setSelectedInfo(
                        achievement.name,
                        achievement.description
                      )
                    }
                  />
                );
              }}
              keyExtractor={([id]) => id}
            />
          )}
        </Box>
      </Row>
    </Rows>
  );
};

export const UserAchievements: FC<{
  userAchievementCounts: Map<string, number>;
  totalPoints?: number;
  userId?: string;
  onDismiss: () => void;
  visible?: boolean;
}> = ({
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
          userAchievementCounts={userAchievementCounts}
          setSelectedInfo={(title, description) =>
            setSelectedInfo({ name: title, description })
          }
        />
      )}
    </Modal>
  );
};
