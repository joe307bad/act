import withObservables from '@nozbe/with-observables';
import React, { FC, useContext, useEffect, useState } from 'react';
import { OptionList } from '../shared/components/Selector/OptionList';
import db, { useGlobalContext } from '@act/data/rn';
import {
  Achievement,
  Checkin,
  CheckinAchievement
} from '@act/data/core';
import { Row, Rows } from '@mobily/stacks';
import { HeaderContext } from '../Entry';
import { Headline } from 'react-native-paper';
import { Q } from '@nozbe/watermelondb';
import { format } from 'date-fns';
import * as services from '../shared/services';
import { useCheckinAchievements } from '../shared/services';

type PendingApproval = {
  id: string;
  title: string;
  subtitle: string;
};

const PendingApprovalsComponent: FC<{
  checkinsAwaitingApproval: Checkin[];
  achievements: Achievement[];
  checkinAchievements: CheckinAchievement[];
}> = ({
  checkinsAwaitingApproval = [],
  achievements = [],
  checkinAchievements = []
}) => {
  const [pendingApprovals, setPendingApprovals] = useState<
    PendingApproval[]
  >([]);
  const { setExcludedPendingApprovals } = useContext(HeaderContext);
  const { fullNamesByUser, usersByCheckin } = useGlobalContext();
  const { getAchievementsByCheckinId } = useCheckinAchievements(
    checkinAchievements
  );

  useEffect(() => {
    setPendingApprovals(
      checkinsAwaitingApproval.map((checkin) => {
        const usersForCheckin = usersByCheckin.get(checkin.id);

        return {
          id: checkin.id,
          subtitle: `${format(
            checkin.createdAt,
            'E M/d @ p'
          )} • ${getAchievementsByCheckinId(checkin.id)
            .map(
              ({ achievementId, count }) =>
                `${count} • ${
                  achievements?.find((a) => a.id === achievementId)
                    .name
                }`
            )
            .join(', ')}`,
          title: usersForCheckin?.reduce(
            (acc, userId, i) =>
              (acc += `${fullNamesByUser.get(userId)} ${
                i === usersForCheckin.length - 1 ? '' : ','
              } `),
            ''
          )
        };
      })
    );
  }, [
    checkinsAwaitingApproval,
    usersByCheckin,
    getAchievementsByCheckinId
  ]);

  return (
    <Rows>
      <Row padding={2} height="content">
        <Headline>
          {pendingApprovals.length} Checkins Pending Approval
        </Headline>
      </Row>
      <Row>
        {/*  
        // TODO how to make this component accept a generic?
        <OptionList<Checkin>*/}
        <OptionList
          // @ts-ignore
          initialSelected={new Map()}
          // @ts-ignore
          optionTitleProperty="title"
          // @ts-ignore
          optionSubtitleProperty="subtitle"
          // @ts-ignore
          data={pendingApprovals}
          paddingTop={2}
          onChange={(selected: Map<string, any>) => {
            setExcludedPendingApprovals(
              new Set(Array.from(selected).map(([id]) => id))
            );
          }}
          onCheckButtonPress={(id: string) =>
            db.models.checkins.approveCheckins(new Set([id]))
          }
          onDeleteButtonPress={db.models.checkins.delete}
        />
      </Row>
    </Rows>
  );
};

export const PendingApprovals = withObservables([''], () => ({
  checkinsAwaitingApproval: db.get
    .get<Checkin>('checkins')
    .query(Q.where('approved', false))
    .observeWithColumns(['approved']),
  achievements: services.$achievements(),
  checkinAchievements: services.$checkinAchievements()
}))(PendingApprovalsComponent);
