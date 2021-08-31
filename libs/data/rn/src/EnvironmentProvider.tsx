import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

type EnvironmentManager = {
  usingTestEnvironment?: boolean;
  apiUrl?: string;
  installTimestamp?: number;
  isFreshInstall?: boolean;
  launchTimestamp?: number;
};

export const EnvironmentContext = createContext<EnvironmentManager>(
  {}
);

export const useEnvironment = () => useContext(EnvironmentContext);

export const EnvironmentProvider: FC = ({ children }) => {
  const [environmentManager, setEnvironmentManager] =
    useState<EnvironmentManager>();

  useEffect(() => {
    AsyncStorage.getItem('installTimestamp')
      .then((installTimestamp): Promise<[number, boolean]> => {
        const now = Date.now();
        if (!installTimestamp) {
          AsyncStorage.setItem('installTimestamp', now.toString());
          return Promise.resolve([Number(now), true]);
        } else {
          return Promise.resolve([Number(installTimestamp), false]);
        }
      })
      .then(
        ([installTimestamp, isFreshInstall]): Promise<
          [string, number, boolean]
        > =>
          AsyncStorage.getItem('apiUrl').then((apiUrl) => {
            const apiUrlBasedOnInstallDate =
              installTimestamp > Number(Config.LAUNCH_TIMESTAMP)
                ? Config.LAUNCH_ACT_API_URL
                : Config.ACT_API_URL;
            if (!apiUrl) {
              AsyncStorage.setItem(
                'apiUrl',
                apiUrlBasedOnInstallDate
              );
              return [
                apiUrlBasedOnInstallDate,
                installTimestamp,
                isFreshInstall
              ];
            } else {
              return [apiUrl, installTimestamp, isFreshInstall];
            }
          })
      )
      .then(([apiUrl, installTimestamp, isFreshInstall]) => {
        setEnvironmentManager({
          installTimestamp,
          usingTestEnvironment: apiUrl === Config.ACT_API_URL,
          apiUrl,
          isFreshInstall,
          launchTimestamp: Number(Config.LAUNCH_TIMESTAMP)
        });
      });
  }, []);

  if (
    !environmentManager ||
    Object.values(environmentManager).some(
      (v) => typeof v === 'undefined'
    )
  ) {
    return <></>;
  }

  return (
    <EnvironmentContext.Provider value={environmentManager}>
      {children}
    </EnvironmentContext.Provider>
  );
};
