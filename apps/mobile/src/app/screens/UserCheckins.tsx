import {
  Headline,
  Surface,
  TouchableRipple
} from 'react-native-paper';
import React, { FC, useState } from 'react';
import { Box, Column, Columns, Row, Rows } from '@mobily/stacks';
import withObservables from '@nozbe/with-observables';
import db, { useActAuth } from '@act/data/rn';
import {
  Achievement,
  Checkin,
  CheckinAchievement,
  CheckinUser,
  User
} from '@act/data/core';
import { Alert, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { map } from 'rxjs/operators';
import { Q } from '@nozbe/watermelondb';
import { format } from 'date-fns';
import Chip from '../shared/components/Chip';
import { isEmpty } from 'lodash';
import { Dropdown } from '../shared/components/Dropdown';

const UserCheckinsComponent: FC<{
  users: User[];
  userCheckins: Map<string, Map<string, string>>;
  checkinAchievements: Map<string, Map<string, number>>;
  checkins: Map<
    string,
    { createdAt: Date; note: string; approved: boolean }
  >;
  achievements: Map<string, { name: string; points: number }>;
}> = ({
  users,
  userCheckins,
  checkins,
  checkinAchievements,
  achievements: a
}) => {
  const { currentUser } = useActAuth();
  const theme = useTheme();
  const [selectedUser, setSelectedUser] = useState(currentUser.id);

  const confirmDeletion = (confirmDelete) =>
    Alert.alert(
      'Confirm Checkin User Deletion',
      'Are you sure you want to delete this checkin user?',
      [{ text: 'Yes', onPress: confirmDelete }, { text: 'No' }]
    );

  const RenderItem = ({ item }) => {
    const [checkinId, checkinUserId] = item;
    const achievements = checkinAchievements.get(checkinId);
    const checkin = checkins.get(checkinId);

    const total = !achievements
      ? 0
      : Array.from(achievements).reduce(
          (acc, [achievementId, count]) => {
            const { points } = a.get(achievementId);
            return (acc += points * count);
          },
          0
        );
    return (
      <Box marginBottom={2} marginTop={2}>
        <Surface
          style={{
            elevation: 2,
            borderTopColor: theme.colors.primary,
            borderTopWidth: 2
          }}
        >
          <Rows padding={2}>
            <Row>
              <Columns alignY="center">
                <Column>
                  <Headline>
                    {checkin &&
                      format(checkin.createdAt, 'EEE MMM do @ pp')}
                  </Headline>
                </Column>
                {!checkin?.approved && (
                  <Column width="content">
                    <MaterialCommunityIcons
                      name={`code-not-equal`}
                      color={theme.colors.primary}
                      size={25}
                    />
                  </Column>
                )}
                {(currentUser.admin ||
                  currentUser.id === selectedUser) && (
                  <Column width="content">
                    <TouchableRipple
                      onPress={() =>
                        confirmDeletion(() =>
                          db.models.checkinUsers.delete(checkinUserId)
                        )
                      }
                    >
                      <MaterialCommunityIcons
                        name={`trash-can-outline`}
                        color={theme.colors.primary}
                        size={25}
                      />
                    </TouchableRipple>
                  </Column>
                )}
              </Columns>
            </Row>
            <Row>
              {!isEmpty(checkin.note) && (
                <Box paddingTop={2} paddingBottom={2}>
                  <Text>{checkin.note}</Text>
                </Box>
              )}
            </Row>
            {achievements && (
              <Row>
                {Array.from(achievements).map(
                  ([achievementId, count], i) => (
                    <Columns
                      key={i}
                      space={2}
                      alignY="center"
                      style={{ padding: 4 }}
                    >
                      <Column
                        width="content"
                        height="fluid"
                        style={{ justifyContent: 'center' }}
                      >
                        <MaterialCommunityIcons
                          name={`numeric-${count}-box`}
                          color={theme.colors.primary}
                          size={25}
                        />
                      </Column>
                      <Column style={{ justifyContent: 'center' }}>
                        <Text numberOfLines={3}>
                          {a.get(achievementId).name}
                        </Text>
                      </Column>
                      <Column width="content">
                        <Chip
                          title={a
                            .get(achievementId)
                            .points.toLocaleString()}
                        />
                      </Column>
                    </Columns>
                  )
                )}
              </Row>
            )}
            {achievements && (
              <Row paddingTop={2}>
                <Box alignX="right">
                  <Chip title={total.toLocaleString()} />
                </Box>
              </Row>
            )}
          </Rows>
        </Surface>
      </Box>
    );
  };

  const checkinsForUser = userCheckins.get(selectedUser);

  return (
    <Rows>
      <Row height="content">
        <Surface style={{ elevation: 2 }}>
          <Dropdown
            fullWidth
            value={selectedUser}
            onValueChange={(v) => setSelectedUser(v)}
            items={users.map((u) => ({
              label: u.fullName,
              value: u.id
            }))}
            padding={3}
          />
        </Surface>
      </Row>
      <Row>
        <Box padding={2} paddingBottom={0} paddingTop={0}>
          {checkinsForUser && (
            <FlatList
              data={Array.from(checkinsForUser).filter(([uc]) =>
                checkins.has(uc)
              )}
              contentContainerStyle={{
                paddingTop: 5
              }}
              renderItem={RenderItem}
              keyExtractor={([c]) => c}
            />
          )}
        </Box>
      </Row>
    </Rows>
  );
};

export const UserCheckins = withObservables([''], () => ({
  users: db.get.get('users').query().observe(),
  achievements: db.get
    .get<Achievement>('achievements')
    .query()
    .observe()
    .pipe(
      map(
        (as) =>
          new Map(
            as.map((a) => [a.id, { name: a.name, points: a.points }])
          )
      )
    ),
  checkins: db.get
    .get<Checkin>('checkins')
    .query()
    .observeWithColumns(['approved'])
    .pipe(
      map(
        (cs) =>
          new Map(
            cs.map((c) => [
              c.id,
              {
                createdAt: c.createdAt,
                note: c.note,
                approved: c.approved
              }
            ])
          )
      )
    ),
  userCheckins: db.get
    .get<CheckinUser>('checkin_users')
    .query()
    .observeWithColumns(['approved'])
    .pipe(
      map((ucs) =>
        ucs
          .sort((a, b) => b.createdAt - a.createdAt)
          .reduce((acc, item) => {
            const exists = acc.get(item.userId);
            if (exists) {
              return acc.set(
                item.userId,
                new Map([
                  ...exists,
                  ...new Map([[item.checkinId, item.id]])
                ])
              );
            } else {
              return acc.set(
                item.userId,
                new Map([[item.checkinId, item.id]])
              );
            }
          }, new Map<string, Map<string, string>>())
      )
    ),
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
    )
}))(UserCheckinsComponent);
