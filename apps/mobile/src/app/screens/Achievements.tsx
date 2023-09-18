import React, { useContext, useMemo, useState } from 'react';
import {
  Achievement,
  AchievementCategory,
  CreateCheckin,
  useDebounce
} from '@act/data/core';
import { FlatList } from 'react-native';
import { SingleCheckin } from '../checkin/SingleCheckin';
import db, { useActAuth, useSync } from '@act/data/rn';
import { CheckinSuccess } from '../checkin/CheckinSuccess';
import { HeaderContext } from '../Entry';
import { AchievementRowLite } from '../achievement/AchievementRowLite';
import { Rows, Row, Box, Columns, Column } from '@mobily/stacks';
import { Surface, useTheme } from 'react-native-paper';
import { Dropdown } from '../shared/components/Dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Switch } from '../shared/components/Switch';
import { isEmpty } from 'lodash';
import withObservables from '@nozbe/with-observables';
import DatabaseProvider, {
  withDatabase
} from '@nozbe/watermelondb/DatabaseProvider';
import { map } from 'rxjs/operators';
import { Database } from '@nozbe/watermelondb';

function Achievements({
  achievements: a,
  categories
}: {
  achievements?: Achievement[];
  categories?: AchievementCategory[];
}) {
  const theme = useTheme();
  const { sync } = useSync();
  const [enableCheckin, setEnableCheckin] = useState(true);

  const { currentUser } = useActAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement>();
  const [confirmedCheckin, setConfirmedCheckin] =
    useState<CreateCheckin>();

  const { searchCriteria } = useContext(HeaderContext);
  const debouncedSearchCriteria = useDebounce(searchCriteria, 500);
  const [note, setNote] = useState('');
  const [showOnlyEnabled, setShowOnlyEnabled] =
    useState<boolean>(false);

  const achievements = useMemo(() => {
    if (!showOnlyEnabled && isEmpty(debouncedSearchCriteria)) {
      return a;
    }

    return a?.filter((a) => {
      if (showOnlyEnabled && !a.enabled) {
        return false;
      }

      return !(
        !isEmpty(debouncedSearchCriteria) &&
        a.name
          .toUpperCase()
          .search(debouncedSearchCriteria.toUpperCase()) == -1
      );
    });
  }, [debouncedSearchCriteria, a, showOnlyEnabled]);

  return (
    <>
      <Rows>
        <Row height="content">
          <Columns alignY="center">
            <Column width="content">
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
                    value={!showOnlyEnabled}
                    onPress={() => setShowOnlyEnabled((p) => !p)}
                  />
                </Column>
              </Columns>
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
                data={achievements}
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
}

const enhance = withObservables(
  [],
  ({ database }: { database: Database }) => {
    return {
      achievements: database
        .get<Achievement>('achievements')
        .query()
        .observeWithColumns([
          'name',
          'points',
          'category_id',
          'photo',
          'enabled'
        ])
        .pipe(
          map((as: Achievement[]) =>
            as.sort((a, b) => b.points - a.points)
          )
        ),
      categories: database
        .get<AchievementCategory>('achievement_categories')
        .query()
        .observeWithColumns(['name'])
    };
  }
);

const A = withDatabase(enhance(Achievements));

export default function () {
  return (
    <DatabaseProvider database={db.get}>
      <A />
    </DatabaseProvider>
  );
}
