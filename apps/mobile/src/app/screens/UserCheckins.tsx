import { Headline, Surface } from 'react-native-paper';
import React, { FC, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  Box,
  Column,
  Columns,
  Row,
  Rows,
  Stack
} from '@mobily/stacks';
import withObservables from '@nozbe/with-observables';
import db, { useActAuth } from '@act/data/rn';
import { Achievement, Checkin, User } from '@act/data/core';
import { ScrollView, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { checkinUsersAndAchievements } from '../shared/queries/checkinUsersAndAchievements';
import { map } from 'rxjs/operators';
import { Q } from '@nozbe/watermelondb';
import { format } from 'date-fns';
import Chip from '../shared/components/Chip';
import { isEmpty } from 'lodash';

const UserCheckinsComponent: FC<{
  users: User[];
  userCheckins: Map<string, Set<string>>;
  checkinAchievements: Map<string, Map<string, number>>;
  checkins: Map<string, { createdAt: Date; note: string }>;
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

  const RenderItem = ({ item }) => {
    const achievements = checkinAchievements.get(item);
    const checkin = checkins.get(item);
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
              <Headline>
                {checkin &&
                  format(checkin.createdAt, 'EEE MMM do @ pp')}
              </Headline>
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
                        <Chip title={a.get(achievementId).points} />
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

  return (
    <Rows>
      <Row height="content">
        <Surface style={{ elevation: 2 }}>
          <Picker
            selectedValue={selectedUser}
            onValueChange={(v) => setSelectedUser(v)}
          >
            {users.map((u) => (
              <Picker.Item
                key={u.id}
                label={u.fullName}
                value={u.id}
              />
            ))}
          </Picker>
        </Surface>
      </Row>
      <Row>
        <Box padding={2} paddingBottom={0}>
          <FlatList
            data={Array.from(userCheckins.get(selectedUser)).filter(
              (uc) => checkins.has(uc)
            )}
            renderItem={RenderItem}
            keyExtractor={(c) => c}
          />
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
    .query(Q.where('approved', true))
    .observeWithColumns(['approved'])
    .pipe(
      map(
        (cs) =>
          new Map(
            cs.map((c) => [
              c.id,
              { createdAt: c.createdAt, note: c.note }
            ])
          )
      )
    ),
  ...checkinUsersAndAchievements()
}))(UserCheckinsComponent);
