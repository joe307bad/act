import {
  Stack,
  Rows,
  Row,
  Column,
  Columns,
  Box
} from '@mobily/stacks';
import React, { FC, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import {
  Headline,
  Surface,
  TouchableRipple,
  useTheme
} from 'react-native-paper';
import { widthPercentageToDP } from 'react-native-responsive-screen';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Chip from '../shared/components/Chip';
import { UserAchievements } from '../achievement/UserAchievements';
import { useGlobalContext } from '@act/data/rn';
import { Achievement, CheckinAchievement } from '@act/data/core';
import {
  useAchievements,
  useCheckinAchievements,
  withCheckinAchievements,
  withAchievements
} from '../shared/services';

const LeaderboardItem: FC<{
  name: string;
  points: number;
  isLast: boolean;
  i: number;
  onPress: () => void;
}> = ({ name, points, isLast, i, onPress }) => {
  const theme = useTheme();
  return (
    <Row>
      <Surface style={{ elevation: 2 }}>
        <TouchableRipple onPress={onPress}>
          <Box padding={2}>
            <Columns alignY="center" alignX="center">
              <Column
                style={{
                  minWidth: widthPercentageToDP(10),
                  alignItems: 'center'
                }}
                width="content"
              >
                {(() => {
                  if (isLast) {
                    return (
                      <MaterialCommunityIcons
                        name="emoticon-poop"
                        color={theme.colors.primary}
                        size={25}
                      />
                    );
                  }

                  switch (i) {
                    case 0:
                      return (
                        <MaterialCommunityIcons
                          name="trophy"
                          color={'#d9b40f'}
                          size={25}
                        />
                      );
                    case 1:
                      return (
                        <MaterialCommunityIcons
                          name="trophy"
                          color={'#949494'}
                          size={25}
                        />
                      );
                    case 2:
                      return (
                        <MaterialCommunityIcons
                          name="trophy"
                          color={'#7d6037'}
                          size={25}
                        />
                      );
                    default:
                      return (
                        <Headline style={{ textAlign: 'center' }}>
                          {i + 1}
                        </Headline>
                      );
                  }
                })()}
              </Column>
              <Column>
                <Headline style={{ textAlign: 'center' }}>
                  {name}
                </Headline>
              </Column>
              <Column width="content">
                <Chip title={points.toLocaleString()} />
              </Column>
            </Columns>
          </Box>
        </TouchableRipple>
      </Surface>
    </Row>
  );
};

type LeaderboardItemData = {
  id: string;
  name: string;
  points: number;
};

const LeaderboardComponent: FC = ({
  checkinAchievements,
  achievements
}: {
  checkinAchievements: CheckinAchievement[];
  achievements: Achievement[];
}) => {
  const {
    checkinsByUser,
    categoriesById,
    fullNamesByUser,
    checkinsById
  } = useGlobalContext();

  const [leaderboard, setLeaderboard] =
    useState<LeaderboardItemData[]>();
  const [achievementsByUser, setAchievementsByUser] =
    useState<Map<string, Map<string, number>>>();
  const [selectedUser, setSelectedUser] = useState<string>();
  const [userAchievementsVisible, setUserAchievementsVisible] =
    useState(false);
  const { getAchievementsByCheckinId } = useCheckinAchievements(
    checkinAchievements
  );
  const { getAchievementById } = useAchievements(achievements);

  useEffect(() => {
    if (checkinsByUser.size > 0) {
      const { leaderboardItems, achievementsByUser: abu } =
        Array.from(checkinsByUser).reduce(
          (acc, userCheckins) => {
            const [userId, checkins] = userCheckins;
            acc.achievementsByUser.set(userId, new Map());
            const userAchievements =
              acc.achievementsByUser.get(userId);

            const totalForCheckins = Array.from(
              checkins.keys()
            ).reduce((acc, checkinId) => {
              const achievementsForCheckin =
                getAchievementsByCheckinId(checkinId);

              const checkinApproved =
                checkinsById.get(checkinId)?.approved;

              if (!achievementsForCheckin || !checkinApproved) {
                return acc;
              }

              const totalForAchievements =
                achievementsForCheckin.reduce(
                  (accc, { achievementId, count }) => {
                    const achievement =
                      getAchievementById(achievementId);
                    if (!achievement) {
                      return accc;
                    }

                    const userAlreadyHasAchievement =
                      userAchievements.get(achievementId);

                    if (userAlreadyHasAchievement) {
                      userAchievements.set(
                        achievementId,
                        userAlreadyHasAchievement + count
                      );
                    } else {
                      userAchievements.set(achievementId, count);
                    }

                    return accc + achievement.points * count;
                  },
                  0
                );
              return acc + totalForAchievements;
            }, 0);
            acc.achievementsByUser.set(userId, userAchievements);
            acc.leaderboardItems.push({
              id: userId,
              name: fullNamesByUser.get(userId),
              points: totalForCheckins
            });
            return acc;
          },
          { leaderboardItems: [], achievementsByUser: new Map() }
        );

      setLeaderboard(
        leaderboardItems.sort((a, b) => b.points - a.points)
      );
      setAchievementsByUser(abu);
    }
  }, [
    getAchievementsByCheckinId,
    getAchievementById,
    checkinsByUser,
    categoriesById,
    fullNamesByUser
  ]);

  return (
    <>
      <ScrollView>
        <Stack space={2} padding={2}>
          <Rows space={3}>
            {leaderboard &&
              leaderboard.map((user, i) => (
                <LeaderboardItem
                  key={i}
                  name={user.name}
                  points={user.points}
                  isLast={checkinsByUser.size === i + 1}
                  i={i}
                  onPress={() => {
                    setUserAchievementsVisible(true);
                    setSelectedUser(user.id);
                  }}
                />
              ))}
          </Rows>
        </Stack>
      </ScrollView>
      {achievementsByUser && (
        <UserAchievements
          userAchievementCounts={achievementsByUser.get(selectedUser)}
          visible={userAchievementsVisible}
          userId={selectedUser}
          onDismiss={() => setUserAchievementsVisible(false)}
          totalPoints={
            leaderboard?.find((lu) => lu.id === selectedUser)
              ?.points || 0
          }
        />
      )}
    </>
  );
};

export const Leaderboard = withAchievements(
  withCheckinAchievements(LeaderboardComponent)
);
