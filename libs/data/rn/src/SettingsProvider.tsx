import { SettingsManager, useDebounce } from '@act/data/core';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { useCallback, useContext } from 'react';
import db, {
  useActAuth,
  useGlobalContext,
  useSync
} from '@act/data/rn';

const SettingsContext =
  createContext<{
    settingsManager?: Partial<SettingsManager>;
    toggleHideCameraFab: () => void;
    setSettingsManager: Dispatch<
      SetStateAction<Partial<SettingsManager>>
    >;
  }>(undefined);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settingsManager, setSettingsManager] =
    useState<Partial<SettingsManager>>();

  const debouncedSettingsManager = useDebounce(settingsManager, 500);
  const { currentUserSettings } = useGlobalContext();

  useEffect(() => {
    if (
      typeof settingsManager === 'undefined' &&
      currentUserSettings
    ) {
      setSettingsManager(currentUserSettings);
    }
  }, [currentUserSettings]);

  const toggleHideCameraFab = useCallback(() => {
    setSettingsManager((p) => ({
      hideCameraFab: !p.hideCameraFab
    }));
  }, []);
  const { currentUser } = useActAuth();
  const { sync } = useSync();

  useEffect(() => {
    if (
      currentUser.id &&
      typeof settingsManager !== 'undefined' &&
      !Array.isArray(settingsManager)
    ) {
      console.log({ savedSettings: settingsManager });
      db.models.users
        .updateSettings(
          currentUser.id,
          settingsManager as SettingsManager
        )
        .then(() => sync());
    }
  }, [debouncedSettingsManager]);
  return (
    <SettingsContext.Provider
      value={{
        settingsManager,
        setSettingsManager,
        toggleHideCameraFab
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
