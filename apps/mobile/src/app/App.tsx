import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';
import { Root } from '../../re/Index.bs';
import { KeycloakProvider } from '@act/data/rn';
import Bugsnag from '@bugsnag/react-native';
import Config from 'react-native-config';
import { Achievement } from '@act/data/core';
import db from '@act/data/rn';

if (Config.ENABLE_BUGSNAG) {
  Bugsnag.start();
}

const GlobalContext =
  createContext<{
    achievementsByCategory: Map<string, Map<string, Achievement>>;
    setAchievementsByCategory: any;
  }>(undefined);

export const useGlobalContext = () => useContext(GlobalContext);

export default () => {
  const [achievementsByCategory, setAchievementsByCategory] =
    useState<Map<string, Map<string, Achievement>>>();
  const achievements = db.useCollection<Achievement>('achievements', [
    'name',
    'category_id'
  ]);
  useEffect(() => {
    setAchievementsByCategory(
      achievements?.length > 0 &&
        achievements.reduce((acc, achievement: Achievement) => {
          const categoryExists = acc.get(achievement.category_id);

          const allExists = acc.get('all');
          if (allExists) {
            acc.set(
              'all',
              new Map([
                ...allExists,
                ...new Map([[achievement.id, achievement]])
              ])
            );
          } else {
            acc.set('all', new Map([[achievement.id, achievement]]));
          }

          if (categoryExists) {
            return acc.set(
              achievement.category_id,
              new Map([
                ...categoryExists,
                ...new Map([[achievement.id, achievement]])
              ])
            );
          }

          return acc.set(
            achievement.category_id,
            new Map([[achievement.id, achievement]])
          );
        }, new Map())
    );
  }, [achievements]);

  return (
    <GlobalContext.Provider
      value={{ achievementsByCategory, setAchievementsByCategory }}
    >
      <KeycloakProvider>
        <Root.make />
      </KeycloakProvider>
    </GlobalContext.Provider>
  );
};
