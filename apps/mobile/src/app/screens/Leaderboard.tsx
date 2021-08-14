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
import { Headline, Surface, useTheme } from 'react-native-paper';
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

const LeaderboardItem: FC<{
  name: string;
  points: number;
  isLast: boolean;
  i: number;
}> = ({ name, points, isLast, i }) => {
  const theme = useTheme();
  return (
    <Row>
      <Surface style={{ elevation: 2 }}>
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
      </Surface>
    </Row>
  );
};

type SortedUser = {
  name: string;
  points: number;
};

const Leaderboard: FC<{
  users: User[];
  userCheckins: Map<string, Set<string>>;
  achievementPoints: Map<string, number>;
  checkinAchievements: Map<string, Map<string, number>>;
  checkins: Set<string>;
}> = ({
  users,
  userCheckins,
  achievementPoints,
  checkinAchievements,
  checkins
}) => {
  const theme = useTheme();
  const [sortedUsers, setSortedUsers] = useState<SortedUser[]>([]);

  useEffect(() => {
    setSortedUsers(
      users
        .map((u) => {
          const uc = userCheckins.get(u.id);
          return {
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
                            const points =
                              achievementPoints.get(achievementId);
                            return accc + (points * count || 0);
                          },
                          0
                        ))
                  );
                }, 0)
          };
        })
        .sort((a, b) => b.points - a.points)
    );
  }, [
    users,
    checkins,
    checkinAchievements,
    userCheckins,
    achievementPoints
  ]);

  return (
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
            />
          ))}
        </Rows>
      </Stack>
    </ScrollView>
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
    .observe()
    .pipe(
      map((cs) => {
        return new Set(cs.map((c) => c.id));
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
  achievementPoints: db.get
    .get<Achievement>('achievements')
    .query()
    .observeWithColumns(['points'])
    .pipe(map((as) => new Map(as.map((a) => [a.id, a.points]))))
}))(Leaderboard);
