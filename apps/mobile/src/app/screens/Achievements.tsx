import React, { FC, useContext, useEffect, useState } from 'react';
import {
  Achievement,
  AchievementCategory,
  CreateCheckin
} from '@act/data/core';
import { FlatList } from 'react-native';
import { TabbedList } from '../shared/components/TabbedList';
import { SingleCheckin } from '../checkin/SingleCheckin';
import db, { useActAuth } from '@act/data/rn';
import { CheckinSuccess } from '../checkin/CheckinSuccess';
import { HeaderContext } from '../Entry';
import { useDebounce } from '../shared/hooks/useDebounce';
import { isEmpty } from 'lodash';
import { AchievementRowLite } from '../achievement/AchievementRowLite';
import { Rows, Row, Box } from '@mobily/stacks';
import { Surface } from 'react-native-paper';
import { Dropdown } from '../shared/components/Dropdown';

const Achievements: FC = () => {
  const achievements = db.useCollection<Achievement>('achievements', [
    'name',
    'category_id'
  ]);
  const categories = [
    { id: 'all', name: 'All' },
    ...db
      .useCollection<AchievementCategory>('achievement_categories', [
        'name'
      ])
      .map((c) => ({ id: c.id, name: c.name })),
    { id: 'noCategory', name: 'No Category' }
  ];

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

  useEffect(() => {
    if (isEmpty(debouncedSearchCriteria)) {
      setHiddenOptions(new Set());
    } else {
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
  }, [debouncedSearchCriteria, achievements]);

  const hideByCategory = (item) =>
    item.category_id !== selectedCategory &&
    selectedCategory !== 'all';

  return (
    <>
      <Rows>
        <Row height="content">
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
                    isHidden={
                      hiddenOptions.has(item.id) ||
                      hideByCategory(item)
                    }
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
        onConfirm={async (note: string) => {
          const checkin: CreateCheckin = {
            achievementCounts: new Map([[selectedAchievement.id, 1]]),
            insertProps: { note },
            isAdmin: currentUser.admin,
            points: selectedAchievement.points,
            users: [currentUser.id]
          };

          const created = await db.models.checkins.create(checkin);
          setConfirmedCheckin({
            ...checkin,
            created
          });
        }}
        onDismiss={() => setSelectedAchievement(undefined)}
      />
      <CheckinSuccess
        visible={!!confirmedCheckin}
        onDismiss={() => {
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
