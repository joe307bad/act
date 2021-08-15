import withObservables, {
  ExtractedObservables
} from '@nozbe/with-observables';
import React, { FC, useContext, useEffect, useState } from 'react';
import { OptionList } from '../shared/components/Selector/OptionList';
import db from '@act/data/rn';
import {
  Achievement,
  Checkin,
  CheckinUser,
  User
} from '@act/data/core';
import { Q } from '@nozbe/watermelondb';
import { Box } from '@mobily/stacks';
import { map } from 'rxjs/operators';
import { CheckinAchievement } from '@act/data/core';
import { HeaderContext } from '../Entry';
import { format } from 'date-fns';

type PendingApproval = {
  id: string;
  users: string;
  subtitle: string;
};

const PendingApprovalsComponent: FC<{
  checkinsPendingApproval: Checkin[];
  checkinUsers: Map<string, Set<string>>;
  checkinAchievements: Map<string, Set<string>>;
  users: Map<string, string>;
  achievements: Map<string, string>;
}> = ({
  achievements,
  checkinsPendingApproval,
  checkinUsers,
  checkinAchievements,
  users
}) => {
  const [pendingApprovals, setPendingApprovals] = useState<
    PendingApproval[]
  >([]);
  const { setExcludedPendingApprovals } = useContext(HeaderContext);

  useEffect(() => {
    if (checkinUsers && checkinAchievements) {
      setPendingApprovals(
        checkinsPendingApproval.reduce((acc, cpa) => {
          const usersForCheckin = checkinUsers.get(cpa.id);
          const achievementsForCheckin = checkinAchievements.get(
            cpa.id
          );
          if (!usersForCheckin || !achievementsForCheckin) {
            return acc;
          }

          acc.push({
            id: cpa.id.toString(),
            users: Array.from(usersForCheckin)
              .map((uid) => users.get(uid))
              .join(', '),
            subtitle: `${format(
              cpa.createdAt,
              'E M/d @ p'
            )} • ${Array.from(achievementsForCheckin)
              .map((aid) => achievements.get(aid))
              .join(', ')}`
          });
          return acc;
        }, [])
      );
    }
  }, [checkinsPendingApproval, checkinUsers]);

  return (
    <Box padding={2} paddingBottom={0}>
      <OptionList<Checkin>
        initialSelected={new Map()}
        optionTitleProperty="users"
        optionSubtitleProperty="subtitle"
        data={pendingApprovals}
        onChange={(selected: Map<string, any>) => {
          setExcludedPendingApprovals(
            new Set(Array.from(selected).map(([id]) => id))
          );
        }}
        onCheckButtonPress={(id: string) =>
          db.models.checkins.approveCheckins(new Set([id]))
        }
      />
    </Box>
  );
};

export const PendingApprovals = withObservables([''], () => {
  return {
    users: db.get
      .get<User>('users')
      .query()
      .observe()
      .pipe(
        map((us) =>
          us.reduce((acc, u) => acc.set(u.id, u.fullName), new Map())
        )
      ),
    achievements: db.get
      .get<Achievement>('achievements')
      .query()
      .observe()
      .pipe(
        map((us) =>
          us.reduce((acc, u) => acc.set(u.id, u.name), new Map())
        )
      ),
    checkinUsers: db.get
      .get<CheckinUser>('checkin_users')
      .query()
      .observe()
      .pipe(
        map((cus) =>
          cus.reduce<Map<string, Set<string>>>((acc, cu) => {
            const exists = acc.get(cu.checkinId);
            if (exists) {
              acc.set(cu.checkinId, new Set([...exists, cu.userId]));
            } else {
              acc.set(cu.checkinId, new Set([cu.userId]));
            }

            return acc;
          }, new Map())
        )
      ),
    checkinsPendingApproval: db.get
      .get<Checkin>('checkins')
      .query(Q.where('approved', false))
      .observeWithColumns(['approved']),
    checkinAchievements: db.get
      .get<CheckinAchievement>('checkin_achievements')
      .query()
      .observe()
      .pipe(
        map((cas) =>
          cas.reduce((acc, item) => {
            const exists = acc.get(item.checkinId);
            if (exists) {
              return acc.set(
                item.checkinId,
                new Set([...exists, item.achievementId])
              );
            } else {
              return acc.set(
                item.checkinId,
                new Set([item.achievementId])
              );
            }
          }, new Map<string, Set<string>>())
        )
      )
  };
})(PendingApprovalsComponent);
