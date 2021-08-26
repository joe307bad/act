import React, { FC, useContext, useEffect, useState } from 'react';
import { Achievement, CreateCheckin } from '@act/data/core';
import { FlatList } from 'react-native';
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
import { useGlobalContext } from '../core/providers/GlobalContextProvider';

const Achievements: FC = () => {
  const { achievementsByCategory, categoriesById } =
    useGlobalContext();
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

  useEffect(() => {
    if (achievementsByCategory.size > 0) {
      if (isEmpty(debouncedSearchCriteria)) {
        setHiddenOptions(new Set());
      } else {
        const achievements = Array.from(
          achievementsByCategory.get('all').values()
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

  const achievements = achievementsByCategory?.get(selectedCategory);
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
