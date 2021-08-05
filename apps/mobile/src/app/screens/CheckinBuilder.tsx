import {
  Achievement,
  AchievementCategory,
  User
} from '@act/data/core';
import db, { useActAuth } from '@act/data/rn';
import Selector from '../shared/components/Selector';
import { ScreenContainer } from '../../../re/Index.bs';
import React, { FC, useState } from 'react';
import { groupBy, toPairs } from 'lodash';
import { ScrollView } from 'react-native';
import { Row, Rows, Stack } from '@mobily/stacks';
import {
  Avatar,
  Card,
  TextInput,
  useTheme
} from 'react-native-paper';
import { AwesomeButtonMedium } from '../AwesomeButton';

const CheckinBuilder: FC = () => {
  const [note, setNote] = useState<string>('');
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
  const theme = useTheme();

  return (
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
                  value={note}
                  mode="outlined"
                  theme={{
                    fonts: {
                      regular: {
                        fontFamily: 'sans-serif'
                      }
                    }
                  }}
                  onChangeText={setNote}
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
              />
            )}
          </Stack>
        </ScrollView>
      </Row>
      <Row padding={1} height="content">
        <AwesomeButtonMedium onPress={() => {}}>
          Create Checkin
        </AwesomeButtonMedium>
      </Row>
    </Rows>
  );
};

export default CheckinBuilder;
