import {
  Headline,
  Surface,
  TouchableRipple
} from 'react-native-paper';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Column,
  Columns,
  Inline,
  Row,
  Rows
} from '@mobily/stacks';
import db, {
  useActAuth,
  useSync,
  useGlobalContext
} from '@act/data/rn';
import { Alert, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import { FlatList } from 'react-native';
import Chip from '../shared/components/Chip';
import { isEmpty } from 'lodash';
import { Dropdown } from '../shared/components/Dropdown';
import { formatTimestamp } from '../core/formatTimestamp';
import { SingleCheckin } from '../checkin/SingleCheckin';
import {
  Achievement,
  CheckinAchievement,
  CreateCheckin
} from '@act/data/core';
import { CheckinSuccess } from '../checkin/CheckinSuccess';
import * as services from '../shared/services';
import {
  useAchievements,
  useCheckinAchievements
} from '../shared/services';

const UserCheckinsComponent = ({
  achievements,
  checkinAchievements
}: {
  checkinAchievements: CheckinAchievement[];
  achievements: Achievement[];
}) => {
  const { currentUser } = useActAuth();
  const theme = useTheme();
  const [selectedUser, setSelectedUser] = useState(currentUser.id);
  const {
    checkinsByUser,
    fullNamesByUser,
    checkinsById,
    usersByCheckin
  } = useGlobalContext();
  const [selectedAchievement, setSelectedAchievement] =
    useState<string>();
  const { getAchievementById } = useAchievements(achievements);
  const { getAchievementsByCheckinId } = useCheckinAchievements(
    checkinAchievements
  );
  const achievement = useMemo(
    () => getAchievementById(selectedAchievement),
    [selectedAchievement]
  );
  const [note, setNote] = useState('');
  const [confirmedCheckin, setConfirmedCheckin] =
    useState<CreateCheckin>();
  const { sync, syncStatus } = useSync();

  const confirmDeletion = (confirmDelete) =>
    Alert.alert(
      'Confirm Checkin User Deletion',
      'Are you sure you want to delete this checkin user?',
      [{ text: 'Yes', onPress: confirmDelete }, { text: 'No' }]
    );

  useEffect(() => {
    if (confirmedCheckin) {
      db.models.checkins.create(confirmedCheckin).then(() => sync());
    }
  }, [confirmedCheckin]);

  const RenderItem = ({ item }) => {
    const [checkinId, checkinUserId] = item;
    const checkin = checkinsById.get(checkinId);
    const achievements = getAchievementsByCheckinId(checkinId);
    const usersForCheckin = usersByCheckin.get(checkinId);

    const total = !achievements
      ? 0
      : achievements.reduce(
          (acc, { achievementId, count, points }) => {
            if (!achievementId) {
              return acc;
            }
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
                    {checkin && formatTimestamp(checkin.createdAt)}
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
              {!isEmpty(checkin?.note) && (
                <Box paddingTop={2} paddingBottom={2}>
                  <Text>{checkin.note}</Text>
                </Box>
              )}
            </Row>
            {achievements && (
              <Row>
                {achievements
                  .sort((a, b) => {
                    return a.points - b.points;
                  })
                  .reduce((acc, { achievementId, count }, i) => {
                    if (!achievementId) {
                      return acc;
                    }
                    return [
                      ...acc,
                      <TouchableRipple
                        key={i}
                        onPress={() =>
                          setSelectedAchievement(achievementId)
                        }
                      >
                        <Columns
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
                          <Column
                            style={{ justifyContent: 'center' }}
                          >
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
                      </TouchableRipple>
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
            {usersForCheckin.length > 1 && (
              <Row width="content">
                <Inline>
                  {usersForCheckin
                    .filter((u) => u !== selectedUser)
                    .map((u) => (
                      <Chip
                        key={u}
                        icon="account"
                        title={fullNamesByUser.get(u)}
                      />
                    ))}
                </Inline>
              </Row>
            )}
          </Rows>
        </Surface>
      </Box>
    );
  };

  const checkinsForUser = checkinsByUser.get(selectedUser);

  return (
    <>
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
      <SingleCheckin
        visible={!!selectedAchievement && !confirmedCheckin}
        achievement={achievement}
        disableSubmit={syncStatus === 'PROCESSING'}
        note={note}
        setNote={setNote}
        onConfirm={async (note: string) => {
          const checkin: CreateCheckin = {
            achievementCounts: new Map([[selectedAchievement, 1]]),
            insertProps: { note },
            isAdmin: currentUser.admin,
            points: achievement.points,
            users: [currentUser.id]
          };

          setConfirmedCheckin({
            ...checkin,
            created: new Date()
          });
        }}
        onDismiss={() => setSelectedAchievement(undefined)}
      />
      <CheckinSuccess
        visible={!!confirmedCheckin}
        onDismiss={() => {
          setNote('');
          setConfirmedCheckin(undefined);
          setSelectedAchievement(undefined);
        }}
        numberOfAchievements={1}
        points={confirmedCheckin?.points || 0}
        timestamp={confirmedCheckin?.created}
        note={confirmedCheckin?.insertProps?.note ?? ''}
        userCount={confirmedCheckin?.users?.length}
        dismissText="Dismiss"
      />
    </>
  );
};

export const UserCheckins = services.withAchievements(
  services.withCheckinAchievements(UserCheckinsComponent)
);
