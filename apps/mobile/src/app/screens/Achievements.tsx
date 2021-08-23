import React, { FC, useContext, useEffect, useState } from 'react';
import {
  Achievement,
  AchievementCategory,
  CreateCheckin
} from '@act/data/core';
import {
  RenderTabbedListOption,
  TabbedList
} from '../shared/components/TabbedList';
import { SingleCheckin } from '../checkin/SingleCheckin';
import db, { useActAuth } from '@act/data/rn';
import { CheckinSuccess } from '../checkin/CheckinSuccess';
import { HeaderContext } from '../Entry';
import { useDebounce } from '../shared/hooks/useDebounce';
import { isEmpty } from 'lodash';
import { FlatList, Text } from 'react-native';
import { Box, Column, Columns } from '@mobily/stacks';
import { Dropdown } from '../shared/components/Dropdown';

const Achievements: FC = () => {
  const achievements = db.useCollection<Achievement>('achievements', [
    'name',
    'category_id'
  ]);
  // const categories = db.useCollection<AchievementCategory>(
  //   'achievement_categories',
  //   ['name']
  // );

  // const { currentUser } = useActAuth();
  // const [selectedAchievement, setSelectedAchievement] =
  //   useState<Achievement>();
  // const [confirmedCheckin, setConfirmedCheckin] =
  //   useState<CreateCheckin>();

  // const { searchCriteria } = useContext(HeaderContext);
  // const debouncedSearchCriteria = useDebounce(searchCriteria, 500);
  // const [hiddenOptions, setHiddenOptions] = useState(
  //   new Set<string>()
  // );

  // useEffect(() => {
  //   if (isEmpty(debouncedSearchCriteria)) {
  //     setHiddenOptions(new Set());
  //   } else {
  //     setHiddenOptions(
  //       new Set(
  //         achievements
  //           .filter(
  //             (a) =>
  //               a.name
  //                 .toUpperCase()
  //                 .search(debouncedSearchCriteria.toUpperCase()) ===
  //               -1
  //           )
  //           .map((a) => a.id)
  //       )
  //     );
  //   }
  // }, [debouncedSearchCriteria, achievements]);

  return (
    <>
      <FlatList
        data={achievements}
        renderItem={(item) => {
          return (
            <Box padding={2}>
              <Columns>
                <Column>
                  <Text>{item.item.name}</Text>
                </Column>
                <Column width="content">
                  <Text>{item.item.points}</Text>
                </Column>
              </Columns>
            </Box>
          );
        }}
        keyExtractor={(item) => item.id}
      />
      {/* <TabbedList<Achievement, AchievementCategory>
        data={achievements}
        hiddenOptions={hiddenOptions}
        categories={categories}
        optionTitleProperty={'name'}
        onOptionSelect={(achievement) =>
          setSelectedAchievement(achievement)
        }
      />
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
      /> */}
    </>
  );
};

export default Achievements;
