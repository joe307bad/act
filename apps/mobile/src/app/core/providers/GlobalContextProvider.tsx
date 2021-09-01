import {
  Achievement,
  AchievementCategory,
  Checkin,
  CheckinAchievement,
  CheckinUser,
  User
} from '@act/data/core';
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from 'react';
import db from '@act/data/rn';
import withObservables from '@nozbe/with-observables';
import { map } from 'rxjs/operators';
const GlobalContext =
  createContext<{
    achievementsByCategory: Map<
      string,
      Map<string, Achievement> | undefined
    >;
    categoriesById: Map<string, AchievementCategory>;
    checkinsByUser: Map<string, Map<string, string>>;
    achievementsByCheckin: Map<string, Map<string, number>>;
    fullNamesByUser: Map<string, string>;
    checkinsById: Map<string, Checkin>;
    usersByCheckin: Map<string, string[]>;
  }>(undefined);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalContextProviderComponent: FC<{
  achievements: Achievement[];
  categories: AchievementCategory[];
  checkins: Checkin[];
  users: User[];
  checkinAchievements: CheckinAchievement[];
  checkinUsers: CheckinUser[];
}> = ({
  categories,
  achievements,
  children,
  checkinAchievements,
  checkinUsers,
  checkins,
  users
}) => {
  const [achievementsByCategory, setAchievementsByCategory] =
    useState<Map<string, Map<string, Achievement>>>(new Map());
  const [categoriesById, setCategoriesById] = useState<
    Map<string, AchievementCategory>
  >(new Map());
  const [checkinsByUser, setCheckinsByUser] = useState<
    Map<string, Map<string, string>>
  >(new Map());
  const [achievementsByCheckin, setAchievementsByCheckins] = useState<
    Map<string, Map<string, number>>
  >(new Map());
  const [fullNamesByUser, setFullNamesByUser] = useState<
    Map<string, string>
  >(new Map());
  const [checkinsById, setCheckinsById] = useState<
    Map<string, Checkin>
  >(new Map());
  const [usersByCheckin, setUsersByCheckin] = useState<
    Map<string, string[]>
  >(new Map());

  useEffect(() => {
    categories.push({ name: 'All', id: 'all' });
    categories.push({ name: 'No Category', id: 'noCategory' });
    setCategoriesById(
      categories.reduce((acc, c) => acc.set(c.id, c), new Map())
    );
  }, [categories]);

  useEffect(() => {
    if (users.length > 0) {
      setFullNamesByUser(
        users.reduce(
          (acc, user) => acc.set(user.id, user.fullName),
          new Map()
        )
      );
    }

    if (checkinUsers) {
      const parsedCheckins = checkins.reduce(
        (acc, checkin) => {
          return {
            checkinsById: acc.checkinsById.set(checkin.id, checkin),
            checkinIds: acc.checkinIds.add(checkin.id),
            achievementsByCheckin: acc.achievementsByCheckin.set(
              checkin.id,
              new Map(
                checkinAchievements
                  .filter((ca) => ca.checkinId === checkin.id)
                  ?.map((ca) => [ca.achievementId, ca.count])
              )
            ),
            usersByCheckin: acc.usersByCheckin.set(
              checkin.id,
              checkinUsers
                .filter((cu) => cu.checkinId === checkin.id)
                ?.map((cu) => cu.userId)
            )
          };
        },
        {
          checkinsById: new Map(),
          checkinIds: new Set(),
          achievementsByCheckin: new Map(),
          usersByCheckin: new Map()
        }
      );

      setAchievementsByCheckins(parsedCheckins.achievementsByCheckin);
      setCheckinsById(parsedCheckins.checkinsById);
      setUsersByCheckin(parsedCheckins.usersByCheckin);

      setCheckinsByUser(
        users.reduce((acc, user) => {
          return acc.set(
            user.id,
            new Map(
              checkinUsers
                .filter(
                  (cu) =>
                    cu.userId === user.id &&
                    parsedCheckins.checkinIds.has(cu.checkinId)
                )
                ?.sort((a, b) => b.createdAt - a.createdAt)
                ?.map((cu) => [cu.checkinId, cu.id])
            )
          );
        }, new Map())
      );
    }
  }, [users, checkins, checkinUsers, checkinAchievements]);

  useEffect(() => {
    setAchievementsByCategory(
      achievements.reduce((acc, achievement: Achievement) => {
        const categoryExists = acc.get(achievement.category?.id);

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

        if (achievement.category?.id === null) {
          const noCategory = acc.get('noCategory');
          if (noCategory) {
            return acc.set(
              'noCategory',
              new Map([
                ...noCategory,
                ...new Map([[achievement.id, achievement]])
              ])
            );
          }

          return acc.set(
            'noCategory',
            new Map([[achievement.id, achievement]])
          );
        }

        if (categoryExists) {
          return acc.set(
            achievement.category?.id,
            new Map([
              ...categoryExists,
              ...new Map([[achievement.id, achievement]])
            ])
          );
        }

        return acc.set(
          achievement.category?.id,
          new Map([[achievement.id, achievement]])
        );
      }, new Map())
    );
  }, [achievements]);

  return (
    <GlobalContext.Provider
      value={{
        checkinsByUser,
        achievementsByCheckin,
        achievementsByCategory,
        categoriesById,
        fullNamesByUser,
        checkinsById,
        usersByCheckin
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const GlobalContextProvider = withObservables([''], () => ({
  achievements: db.get
    .get<Achievement>('achievements')
    .query()
    .observeWithColumns(['name', 'points', 'category_id', 'photo'])
    .pipe(map((as) => as.sort((a, b) => b.points - a.points))),
  categories: db.get
    .get<AchievementCategory>('achievement_categories')
    .query()
    .observeWithColumns(['name']),
  checkins: db.get
    .get<Checkin>('checkins')
    .query()
    .observeWithColumns(['approved']),
  checkinUsers: db.get
    .get<CheckinUser>('checkin_users')
    .query()
    .observe(),
  checkinAchievements: db.get
    .get<CheckinAchievement>('checkin_achievements')
    .query()
    .observeWithColumns(['count']),
  users: db.get
    .get<User>('users')
    .query()
    .observeWithColumns(['full_name'])
}))(GlobalContextProviderComponent);
