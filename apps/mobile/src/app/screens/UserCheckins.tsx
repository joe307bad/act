import {
  Headline,
  Surface,
  TouchableRipple
} from 'react-native-paper';
import React, { useState } from 'react';
import { Box, Column, Columns, Row, Rows } from '@mobily/stacks';
import db, { useActAuth } from '@act/data/rn';
import { Alert, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import Chip from '../shared/components/Chip';
import { isEmpty } from 'lodash';
import { Dropdown } from '../shared/components/Dropdown';
import { useGlobalContext } from '../core/providers/GlobalContextProvider';

export const UserCheckins = () => {
  const { currentUser } = useActAuth();
  const theme = useTheme();
  const [selectedUser, setSelectedUser] = useState(currentUser.id);
  const {
    achievementsByCategory,
    checkinsByUser,
    fullNamesByUser,
    checkinsById,
    achievementsByCheckin
  } = useGlobalContext();
  const achievementsById = achievementsByCategory.get('all');

  const confirmDeletion = (confirmDelete) =>
    Alert.alert(
      'Confirm Checkin User Deletion',
      'Are you sure you want to delete this checkin user?',
      [{ text: 'Yes', onPress: confirmDelete }, { text: 'No' }]
    );

  const RenderItem = ({ item }) => {
    const [checkinId, checkinUserId] = item;
    const achievements = achievementsByCheckin.get(checkinId);
    const checkin = checkinsById.get(checkinId);

    const total = !achievements
      ? 0
      : Array.from(achievements).reduce(
          (acc, [achievementId, count]) => {
            const achievement = achievementsById.get(achievementId);
            if (!achievement) {
              return acc;
            }
            const { points } = achievement;
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
                {Array.from(achievements)
                  .sort((a, b) => {
                    const prevAachievement = achievementsById.get(
                      b[0]
                    );
                    const achievement = achievementsById.get(a[0]);
                    if (!prevAachievement || !achievement) {
                      return 0;
                    }
                    return (
                      prevAachievement.points - achievement.points
                    );
                  })
                  .reduce((acc, [achievementId, count], i) => {
                    const achievement =
                      achievementsById.get(achievementId);
                    if (!achievement) {
                      return acc;
                    }
                    return [
                      ...acc,
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
                            {achievement.name}
                          </Text>
                        </Column>
                        <Column width="content">
                          <Chip
                            title={achievement.points.toLocaleString()}
                          />
                        </Column>
                      </Columns>
                    ];
                  }, [])}
              </Row>
            )}
            <Row paddingTop={2}>
              <Columns>
                <Column>
                  <Box alignX="left">
                    <Chip
                      icon="music-accidental-sharp"
                      title={checkinId}
                    />
                  </Box>
                </Column>
                {achievements && (
                  <Column>
                    <Box alignX="right">
                      <Chip title={total.toLocaleString()} />
                    </Box>
                  </Column>
                )}
              </Columns>
            </Row>
          </Rows>
        </Surface>
      </Box>
    );
  };

  const checkinsForUser = checkinsByUser.get(selectedUser);

  return (
    <Rows>
      <Row height="content">
        <Surface style={{ elevation: 2 }}>
          <Dropdown
            fullWidth
            value={selectedUser}
            onValueChange={(v) => setSelectedUser(v)}
            items={Array.from(fullNamesByUser).map(
              ([userId, fullName]) => ({
                label: fullName,
                value: userId
              })
            )}
            padding={3}
          />
        </Surface>
      </Row>
      <Row>
        <Box padding={2} paddingBottom={0} paddingTop={0}>
          {checkinsForUser && (
            <FlatList
              data={Array.from(checkinsForUser)}
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
