import withObservables from '@nozbe/with-observables';
import { CheckinAchievement } from '@act/data/core';
import React, { useCallback } from 'react';
import db from '@act/data/rn';
import memoizeOne from 'memoize-one';

export function useCheckinAchievements(
  checkinAchievements: CheckinAchievement[]
) {
  return {
    getAchievementsByCheckinId: useCallback(
      memoizeOne((checkinId: string) => {
        return checkinAchievements
          .filter((ca) => ca.checkinId === checkinId)
          .map(
            (
              ca
            ): {
              achievementId?: string;
              count: number;
              points: number;
            } => ({
              ...ca.achievement,
              count: ca.count
            })
          );
      }),
      [checkinAchievements]
    )
  };
}

export const $checkinAchievements = () =>
  db.get
    .get<CheckinAchievement>('checkin_achievements')
    .query()
    .observeWithColumns(['count']);

const enhance = withObservables([''], () => {
  return {
    checkinAchievements: $checkinAchievements()
  };
});

export function withCheckinAchievements(Component) {
  return enhance(Component);
}
