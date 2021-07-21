import React, { createContext, FC, useState } from 'react';
import db from '@act/data/web';

export const CheckinContext = createContext<CheckinStore>(undefined);

type GetAndSet<T> = {
  get: T;
  set: React.Dispatch<React.SetStateAction<T>>;
};

type CheckinStore = {
  model: {
    note: GetAndSet<string>;
    approved: GetAndSet<boolean>;
    achievements: GetAndSet<Map<string, SelectedItem>>;
    users: GetAndSet<Map<string, SelectedItem>>;
  };
  achievementCounts: GetAndSet<Map<string, number>>;
  setSelectedAchievementCountById: (
    id: string,
    count: number
  ) => void;
};

type SelectedItem = {
  id: string;
  name: string;
  count?: number;
  points?: number;
};

export const CheckinProvider = ({ children }) => {
  const [note, setNote] = useState('');
  const [approved, setApproved] = useState(false);
  const [selectedAchievements, setSelectedAchievements] = useState(
    new Map<string, SelectedItem>()
  );
  const [achievementCounts, setAchievementCounts] = useState(
    new Map<string, number>()
  );
  const [selectedUsers, setSelectedUsers] = useState(
    new Map<string, SelectedItem>()
  );

  const setSelectedAchievementCountById = (
    id: string,
    count: number
  ) => {
    const newSelectedAchievements = new Map(selectedAchievements);
    const a = newSelectedAchievements.get(id);
    if (a) {
      newSelectedAchievements.set(id, { ...a, count });
      setSelectedAchievements(newSelectedAchievements);
    }
  };

  return (
    <CheckinContext.Provider
      value={{
        model: {
          note: { set: setNote, get: note },
          approved: { set: setApproved, get: approved },
          achievements: {
            set: setSelectedAchievements,
            get: selectedAchievements
          },
          users: { set: setSelectedUsers, get: selectedUsers }
        },
        achievementCounts: {
          set: setAchievementCounts,
          get: achievementCounts
        },
        setSelectedAchievementCountById
      }}
    >
      {children}
    </CheckinContext.Provider>
  );
};
