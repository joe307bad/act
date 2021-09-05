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

type GlobalContext = {
  achievementsByCategory: [
    Map<string, Map<string, Achievement>>,
    Map<string, Map<string, Achievement>>
  ];
  categoriesById: Map<string, AchievementCategory>;
  checkinsByUser: Map<string, Map<string, string>>;
  achievementsByCheckin: Map<string, Map<string, number>>;
  fullNamesByUser: Map<string, string>;
  checkinsById: Map<string, Checkin>;
  usersByCheckin: Map<string, string[]>;
};

const GlobalContext = createContext<Partial<GlobalContext>>({
  achievementsByCategory: [new Map(), new Map()],
  categoriesById: new Map(),
  checkinsByUser: new Map(),
  achievementsByCheckin: new Map(),
  fullNamesByUser: new Map(),
  checkinsById: new Map(),
  usersByCheckin: new Map()
});

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
    useState<
      [
        Map<string, Map<string, Achievement>>,
        Map<string, Map<string, Achievement>>
      ]
    >([new Map(), new Map()]);
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

  const addToCategory = (
    achievement: Achievement,
    enabledOnly: boolean,
    category: string,
    acc: Map<string, Map<string, Achievement>>
  ) => {
    const cat = acc.get(category);

    if (enabledOnly) {
      if (cat) {
        return achievement.enabled
          ? acc.set(
              category,
              new Map([
                ...cat,
                ...new Map([[achievement.id, achievement]])
              ])
            )
          : acc;
      }

      return achievement.enabled
        ? acc.set(category, new Map([[achievement.id, achievement]]))
        : acc;
    }

    if (cat) {
      acc.set(
        category,
        new Map([...cat, ...new Map([[achievement.id, achievement]])])
      );
      return acc;
    }

    acc.set(category, new Map([[achievement.id, achievement]]));
    return acc;
  };

  useEffect(() => {
    const a = achievements.reduce(
      (
        acc: [
          Map<string, Map<string, Achievement>>,
          Map<string, Map<string, Achievement>>
        ],
        achievement: Achievement
      ) => {
        let [enabled, all] = acc;

        (all = addToCategory(achievement, false, 'all', all)),
          (enabled = addToCategory(
            achievement,
            true,
            'all',
            enabled
          ));

        if (achievement.category?.id === null) {
          return [
            addToCategory(achievement, true, 'noCategory', enabled),
            addToCategory(achievement, false, 'noCategory', all)
          ];
        }

        return [
          addToCategory(
            achievement,
            true,
            achievement.category.id || undefined,
            enabled
          ),
          addToCategory(
            achievement,
            false,
            achievement.category.id || undefined,
            all
          )
        ];
      },
      [new Map(), new Map()]
    );

    setAchievementsByCategory(
      a as [
        Map<string, Map<string, Achievement>>,
        Map<string, Map<string, Achievement>>
      ]
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
