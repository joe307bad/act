import withObservables from '@nozbe/with-observables';
import { Achievement, AchievementCategory } from '@act/data/core';
import { map } from 'rxjs/operators';
import React, { useCallback } from 'react';
import db from '@act/data/rn';
import memoizeOne from 'memoize-one';

export function useAchievements(achievements: Achievement[]) {
  return {
    getAchievementsByCategory: useCallback(
      memoizeOne((categoryId) => {
        return achievements.filter(
          // @ts-ignore
          (a) => a.category_id === categoryId
        );
      }),
      [achievements]
    ),
    getAchievementById: useCallback(
      memoizeOne((achievementId: string) => {
        return achievements.find((a) => a.id === achievementId);
      }),
      [achievements]
    )
  };
}

export const $achievements = () => {
  return db.get
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
    );
};

const enhance = withObservables([''], () => {
  return {
    achievements: $achievements(),
    categories: db.get
      .get<AchievementCategory>('achievement_categories')
      .query()
      .observeWithColumns(['name'])
  };
});

export function withAchievements(Component) {
  return enhance(Component);
}
