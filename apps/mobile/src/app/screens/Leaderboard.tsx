import {
  Stack,
  Rows,
  Row,
  Column,
  Columns,
  Box
} from '@mobily/stacks';
import React, { FC, useState, useEffect } from 'react';
import { Pressable, ScrollView } from 'react-native';
import {
  Headline,
  Surface,
  TouchableRipple,
  useTheme
} from 'react-native-paper';
import { widthPercentageToDP } from 'react-native-responsive-screen';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Chip from '../shared/components/Chip';
import withObservables from '@nozbe/with-observables';
import db from '@act/data/rn';
import {
  Achievement,
  Checkin,
  CheckinUser,
  User
} from '@act/data/core';
import { map } from 'rxjs/operators';
import { CheckinAchievement } from 'libs/data/core/src/lib/schema/checkin-achievement';
import { UserAchievements } from '../achievement/UserAchievements';

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
                <Headline>
                  <Chip title={points.toLocaleString()} />
                </Headline>
              </Column>
            </Columns>
          </Box>
        </TouchableRipple>
      </Surface>
    </Row>
  );
};

type LeaderboardItemData = {
  name: string;
  points: number;
};

const Leaderboard: FC<{
  users: User[];
  userCheckins: Map<string, Set<string>>;
  achievements: Map<
    string,
    {
      points: number;
      name: string;
      category_id: string;
      fixedCount: number;
      description: string;
    }
  >;
  checkinAchievements: Map<string, Map<string, number>>;
  checkins: Set<string>;
}> = ({
  users,
  userCheckins,
  achievements: achievementsById,
  checkinAchievements,
  checkins
}) => {
  const [leaderboard, setLeaderboard] = useState<
    Map<string, LeaderboardItemData>
  >(new Map());
  const [sortedUsers, setSortedUsers] = useState<
    (LeaderboardItemData & { id: string })[]
  >([]);
  const [selectedUser, setSelectedUser] =
    useState<{ userId: string; name: string }>();
  const [userAchievementsVisible, setUserAchievementsVisible] =
    useState(false);

  useEffect(() => {
    const lboard: Map<string, LeaderboardItemData> = users.reduce(
      (acc, u) => {
        const uc = userCheckins.get(u.id);
        return acc.set(u.id, {
          name: u.fullName,
          points: !uc
            ? 0
            : Array.from(uc).reduce((acc, checkinId) => {
                const achievements =
                  checkinAchievements.get(checkinId);
                return (
                  acc +
                  (!achievements || !checkins.has(checkinId)
                    ? 0
                    : Array.from(achievements).reduce(
                        (accc, [achievementId, count]) => {
                          const a =
                            achievementsById.get(achievementId);
                          return accc + (a.points * count || 0);
                        },
                        0
                      ))
                );
              }, 0)
        });
      },
      new Map()
    );
    setLeaderboard(lboard);
    setSortedUsers(
      Array.from(lboard)
        .map(([id, user]) => ({
          ...user,
          id
        }))
        .sort((a, b) => b.points - a.points)
    );
  }, [
    users,
    checkins,
    checkinAchievements,
    userCheckins,
    achievementsById
  ]);

  return (
    <>
      <ScrollView>
        <Stack space={2} padding={2}>
          <Rows space={3}>
            {sortedUsers.map((user, i) => (
              <LeaderboardItem
                key={i}
                name={user.name}
                points={user.points}
                isLast={users.length === i + 1}
                i={i}
                onPress={() => {
                  setUserAchievementsVisible(true);
                  setSelectedUser({
                    userId: user.id,
                    name: user.name
                  });
                }}
              />
            ))}
          </Rows>
        </Stack>
      </ScrollView>
      <UserAchievements
        checkins={checkins}
        achievementsById={achievementsById}
        checkinAchievements={checkinAchievements}
        userCheckins={userCheckins}
        visible={userAchievementsVisible}
        name={selectedUser?.name}
        userId={selectedUser?.userId}
        onDismiss={() => setUserAchievementsVisible(false)}
        totalPoints={
          leaderboard.get(selectedUser?.userId)?.points || 0
        }
      />
    </>
  );
};

export default withObservables([''], () => ({
  users: db.get.get('users').query().observe(),
  checkinAchievements: db.get
    .get<CheckinAchievement>('checkin_achievements')
    .query()
    .observeWithColumns(['count'])
    .pipe(
      map((cas) =>
        cas.reduce((acc, item) => {
          const exists = acc.get(item.checkinId);
          if (exists) {
            return acc.set(
              item.checkinId,
              new Map([
                ...exists,
                ...new Map([[item.achievementId, item.count]])
              ])
            );
          } else {
            return acc.set(
              item.checkinId,
              new Map([[item.achievementId, item.count]])
            );
          }
        }, new Map<string, Map<string, number>>())
      )
    ),
  checkins: db.get
    .get<Checkin>('checkins')
    .query()
    .observeWithColumns(['approved'])
    .pipe(
      map((cs) => {
        return new Set(
          cs.reduce((acc, c) => {
            if (!c.approved) {
              return acc;
            }
            return acc.add(c.id);
          }, new Set())
        );
      })
    ),
  userCheckins: db.get
    .get<CheckinUser>('checkin_users')
    .query()
    .observe()
    .pipe(
      map((ucs) =>
        ucs.reduce((acc, item) => {
          const exists = acc.get(item.userId);
          if (exists) {
            return acc.set(
              item.userId,
              new Set([...exists, item.checkinId])
            );
          } else {
            return acc.set(item.userId, new Set([item.checkinId]));
          }
        }, new Map<string, Set<string>>())
      )
    ),
  achievements: db.get
    .get<Achievement>('achievements')
    .query()
    .observeWithColumns(['points'])
    .pipe(
      map(
        (as) =>
          new Map(
            as.map((a) => [
              a.id,
              {
                points: a.points,
                name: a.name,
                category_id: a.category.id,
                description: a.description
              }
            ])
          )
      )
    )
}))(Leaderboard);
