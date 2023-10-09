import {
  Achievement,
  AchievementCategory,
  Checkin,
  CheckinAchievement,
  CheckinUser,
  SettingsManager,
  User,
  Upload
} from '@act/data/core';
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from 'react';
import db, { useActAuth } from '@act/data/rn';
import withObservables from '@nozbe/with-observables';
import { map } from 'rxjs/operators';

type GlobalContext = {
  categoriesById: Map<string, AchievementCategory>;
  checkinsByUser: Map<string, Map<string, string>>;
  fullNamesByUser: Map<string, string>;
  checkinsById: Map<string, Checkin>;
  usersByCheckin: Map<string, string[]>;
  currentUserSettings: Partial<SettingsManager>;
  uploads: string[];
};

const GlobalContext = createContext<Partial<GlobalContext>>({
  categoriesById: new Map(),
  checkinsByUser: new Map(),
  fullNamesByUser: new Map(),
  checkinsById: new Map(),
  usersByCheckin: new Map(),
  currentUserSettings: {} as SettingsManager,
  uploads: []
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalContextProviderComponent: FC<{
  categories: AchievementCategory[];
  checkins: Checkin[];
  users: User[];
  checkinAchievements: CheckinAchievement[];
  checkinUsers: CheckinUser[];
  uploads: string[];
}> = ({
  categories,
  children,
  checkinAchievements,
  checkinUsers,
  checkins,
  users,
  uploads
}) => {
  const [categoriesById, setCategoriesById] = useState<
    Map<string, AchievementCategory>
  >(new Map());
  const [checkinsByUser, setCheckinsByUser] = useState<
    Map<string, Map<string, string>>
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

  const [currentUserSettings, setCurrentUserSettings] = useState<
    Partial<SettingsManager>
  >({});

  const { currentUser } = useActAuth();

  useEffect(() => {
    categories.push({ name: 'All', id: 'all' });
    categories.push({ name: 'No Category', id: 'noCategory' });
    setCategoriesById(
      categories.reduce((acc, c) => acc.set(c.id, c), new Map())
    );
  }, [categories]);

  useEffect(() => {
    if (users.length > 0 && currentUser?.id) {
      try {
        setCurrentUserSettings(
          JSON.parse(
            users.find((u) => u.id === currentUser?.id)?.settings ||
              '[]'
          )
        );
      } catch (e) {}
    }
  }, [users, currentUser]);

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

  return (
    <GlobalContext.Provider
      value={{
        checkinsByUser,
        categoriesById,
        fullNamesByUser,
        checkinsById,
        usersByCheckin,
        currentUserSettings,
        uploads
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const GlobalContextProvider = withObservables([''], () => ({
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
    .observeWithColumns(['full_name', 'settings']),
  uploads: db.get
    .get<Upload>('uploads')
    .query()
    .observe()
    .pipe(
      map((us) =>
        us
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((u) => u.name)
      )
    )
}))(GlobalContextProviderComponent);
