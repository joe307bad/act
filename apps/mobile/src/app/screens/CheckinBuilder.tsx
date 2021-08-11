import {
  Achievement,
  AchievementCategory,
  Checkin,
  User
} from '@act/data/core';
import db, { useActAuth } from '@act/data/rn';
import Selector from '../shared/components/Selector';
import React, { FC, useState } from 'react';
import { groupBy, toPairs } from 'lodash';
import { ScrollView } from 'react-native';
import { Row, Rows, Stack } from '@mobily/stacks';
import { Avatar, Card, TextInput } from 'react-native-paper';
import { AwesomeButtonMedium } from '../AwesomeButton';
import { CreateCheckin } from '@act/data/core';
import { CheckinSuccess } from '../checkin/CheckinSuccess';

const CheckinBuilder: FC = () => {
  const users = db.useCollection<User>('users');
  const achievements = db.useCollection<Achievement>('achievements', [
    'name',
    'category_id'
  ]);
  const categories = db.useCollection<AchievementCategory>(
    'achievement_categories',
    ['name']
  );
  const achievementsByCategory = toPairs(
    groupBy(achievements, 'category_id')
  );
  const { currentUser } = useActAuth();
  const defaultSelectedUser = currentUser
    ? new Map([
        [
          currentUser.id,
          { display: currentUser.username, id: currentUser.id }
        ]
      ])
    : undefined;

  achievementsByCategory.push(['All', achievements]);

  const [checkin, setCheckin] = useState<CreateCheckin>();

  return (
    <>
      <Rows space={2}>
        <Row>
          <ScrollView>
            <Stack space={2} padding={2}>
              <Card>
                <Card.Title
                  title="Checkin Note"
                  subtitle="Write a note for this checkin"
                  left={(props) => (
                    <Avatar.Icon
                      {...props}
                      icon="pencil-circle-outline"
                    />
                  )}
                />
                <Card.Content style={{ display: 'flex' }}>
                  <TextInput
                    textAlign="left"
                    label="Checkin Note"
                    value={checkin?.insertProps?.note}
                    mode="outlined"
                    theme={{
                      fonts: {
                        regular: {
                          fontFamily: 'sans-serif'
                        }
                      }
                    }}
                    onChangeText={(text) =>
                      setCheckin({
                        ...checkin,
                        insertProps: { note: text }
                      })
                    }
                  />
                </Card.Content>
              </Card>
              <Selector<Achievement, AchievementCategory>
                data={achievements}
                categories={categories}
                single="Achievement"
                plural="Achievements"
                icon="checkbox-multiple-marked-circle-outline"
                optionTitleProperty="name"
                title="Checkin Achievements"
                subtitle="Select one or more achievements to checkin"
                fullHeight={true}
                showCountDropdown={true}
                showPointCount={true}
                selectable={true}
                showInfoButton={true}
                onInfoButtonPress={() => {}}
                onSelectorChange={(
                  achievementCounts: Map<string, number>
                ) => setCheckin({ ...checkin, achievementCounts })}
              />
              {currentUser?.admin && (
                <Selector<User>
                  data={users}
                  defaultSelected={defaultSelectedUser}
                  single="User"
                  plural="Users"
                  icon="account-box-multiple-outline"
                  optionTitleProperty="fullName"
                  optionSubtitleProperty="username"
                  title="Checkin Users"
                  subtitle="Select one or more users to checkin"
                  inlineTags={true}
                  onSelectorChange={(selectedItems: Set<string>) =>
                    setCheckin({
                      ...checkin,
                      users: Array.from(selectedItems)
                    })
                  }
                />
              )}
            </Stack>
          </ScrollView>
        </Row>
        <Row padding={1} height="content">
          <AwesomeButtonMedium
            onPress={() => db.models.checkins.create(checkin)}
          >
            Create Checkin
          </AwesomeButtonMedium>
        </Row>
      </Rows>
      <CheckinSuccess />
    </>
  );
};

export default CheckinBuilder;
