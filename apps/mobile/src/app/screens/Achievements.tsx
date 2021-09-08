import React, { FC, useContext, useEffect, useState } from 'react';
import {
  Achievement,
  CreateCheckin,
  useDebounce
} from '@act/data/core';
import { FlatList } from 'react-native';
import { SingleCheckin } from '../checkin/SingleCheckin';
import db, {
  useActAuth,
  useSync,
  useGlobalContext
} from '@act/data/rn';
import { CheckinSuccess } from '../checkin/CheckinSuccess';
import { HeaderContext } from '../Entry';
import { isEmpty } from 'lodash';
import { AchievementRowLite } from '../achievement/AchievementRowLite';
import { Rows, Row, Box, Columns, Column } from '@mobily/stacks';
import {
  Surface,
  TouchableRipple,
  useTheme
} from 'react-native-paper';
import { Dropdown } from '../shared/components/Dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Switch } from '../shared/components/Switch';

const Achievements: FC = () => {
  const theme = useTheme();
  const { achievementsByCategory, categoriesById } =
    useGlobalContext();
  const [enabledAchievementsByCategory, allAchievementsByCategory] =
    achievementsByCategory;

  const { sync } = useSync();
  const [enableCheckin, setEnableCheckin] = useState(true);
  const categories = Array.from(categoriesById.values());

  const { currentUser } = useActAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement>();
  const [confirmedCheckin, setConfirmedCheckin] =
    useState<CreateCheckin>();

  const { searchCriteria } = useContext(HeaderContext);
  const debouncedSearchCriteria = useDebounce(searchCriteria, 500);
  const [hiddenOptions, setHiddenOptions] = useState(
    new Set<string>()
  );
  const [note, setNote] = useState('');
  const [showOnlyEnabled, setShowOnlyEnabled] = useState<boolean>();

  const achievements = (() => {
    if (showOnlyEnabled) {
      return enabledAchievementsByCategory.get(selectedCategory);
    }

    return allAchievementsByCategory.get(selectedCategory);
  })();

  useEffect(() => {
    if (enabledAchievementsByCategory.size > 0) {
      if (isEmpty(debouncedSearchCriteria)) {
        setHiddenOptions(new Set());
      } else {
        const achievements = Array.from(
          allAchievementsByCategory.get('all').values()
        );
        setHiddenOptions(
          new Set(
            achievements
              .filter(
                (a) =>
                  a.name
                    .toUpperCase()
                    .search(debouncedSearchCriteria.toUpperCase()) ===
                  -1
              )
              .map((a) => a.id)
          )
        );
      }
    }
  }, [debouncedSearchCriteria]);

  return (
    <>
      <Rows>
        <Row height="content">
          <Columns alignY="center">
            <Column width="content">
              <TouchableRipple
                onPress={() => setShowOnlyEnabled((p) => !p)}
              >
                <Columns alignY="center" padding={2}>
                  <Column width="content">
                    <MaterialCommunityIcons
                      name="death-star"
                      color={theme.colors.primary}
                      size={20}
                    />
                  </Column>
                  <Column width="content">
                    <Switch
                      disabled={true}
                      value={!showOnlyEnabled}
                    />
                  </Column>
                </Columns>
              </TouchableRipple>
            </Column>
            <Column>
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
            </Column>
          </Columns>
        </Row>
        <Row>
          <Box padding={2} paddingBottom={0} paddingTop={0}>
            {achievements && (
              <FlatList
                data={
                  hiddenOptions.size === 0
                    ? Array.from(achievements.values())
                    : Array.from(achievements.values()).filter(
                        (a) => !hiddenOptions.has(a.id)
                      )
                }
                renderItem={({ item }) => (
                  <AchievementRowLite
                    item={item}
                    onPress={() => setSelectedAchievement(item)}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            )}
          </Box>
        </Row>
      </Rows>
      <SingleCheckin
        visible={!!selectedAchievement && !confirmedCheckin}
        achievement={selectedAchievement}
        disableSubmit={!enableCheckin}
        note={note}
        setNote={setNote}
        onConfirm={async (note: string) => {
          setEnableCheckin(false);
          const checkin: CreateCheckin = {
            achievementCounts: new Map([[selectedAchievement.id, 1]]),
            insertProps: { note },
            isAdmin: currentUser.admin,
            points: selectedAchievement.points,
            users: [currentUser.id]
          };

          setConfirmedCheckin({
            ...checkin,
            created: new Date()
          });
          db.models.checkins
            .create(checkin)
            .then(() => sync().finally(() => setEnableCheckin(true)));
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

export default Achievements;
