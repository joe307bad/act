import withObservables from '@nozbe/with-observables';
import React, { FC, useContext, useEffect, useState } from 'react';
import { OptionList } from '../shared/components/Selector/OptionList';
import db from '@act/data/rn';
import { Checkin } from '@act/data/core';
import { Box, Row, Rows } from '@mobily/stacks';
import { HeaderContext } from '../Entry';
import { Headline } from 'react-native-paper';
import { useGlobalContext } from '../core/providers/GlobalContextProvider';
import { Q } from '@nozbe/watermelondb';
import { format } from 'date-fns';

type PendingApproval = {
  id: string;
  title: string;
  subtitle: string;
};

const PendingApprovalsComponent: FC<{
  checkinsAwaitingApproval: Checkin[];
}> = ({ checkinsAwaitingApproval = [] }) => {
  const [pendingApprovals, setPendingApprovals] = useState<
    PendingApproval[]
  >([]);
  const { setExcludedPendingApprovals } = useContext(HeaderContext);
  const {
    achievementsByCategory,
    achievementsByCheckin,
    fullNamesByUser,
    usersByCheckin
  } = useGlobalContext();
  const achievements = achievementsByCategory.get('all');

  useEffect(() => {
    setPendingApprovals(
      checkinsAwaitingApproval.map((checkin) => {
        const usersForCheckin = usersByCheckin.get(checkin.id);

        return {
          id: checkin.id,
          subtitle: `${format(
            checkin.createdAt,
            'E M/d @ p'
          )} • ${Array.from(
            achievementsByCheckin.get(checkin.id) || []
          )
            .map(
              ([aid, count]) =>
                `${count} • ${achievements?.get(aid).name}`
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
    achievementsByCheckin,
    usersByCheckin
  ]);

  return (
    <Rows>
      <Row padding={2} height="content">
        <Headline>
          {pendingApprovals.length} Checkins Pending Approval
        </Headline>
      </Row>
      <Row>
        <OptionList<Checkin>
          initialSelected={new Map()}
          optionTitleProperty="title"
          optionSubtitleProperty="subtitle"
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
    .observeWithColumns(['approved'])
}))(PendingApprovalsComponent);
