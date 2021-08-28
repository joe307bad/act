import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

const InstallManagerContext =
  createContext<{
    forceReinstall: boolean;
  }>(undefined);

export const useInstallManagerContext = () =>
  useContext(InstallManagerContext);

export const InstallManagerProvider: FC = ({ children }) => {
  const [forceReinstall, setForceReinstall] =
    useState<boolean | undefined>();
  useEffect(() => {
    AsyncStorage.getItem('installDate').then((installDate) => {
      const fr = (() => {
        if (!installDate) {
          AsyncStorage.setItem('installDate', Date.now().toString());
        } else if (
          Date.now() > Number(Config.LAUNCH_TIMESTAMP) &&
          Number(installDate) < Number(Config.LAUNCH_TIMESTAMP)
        ) {
          return true;
        }

        return false;
      })();
      setForceReinstall(fr);
    });
  }, []);

  if (typeof forceReinstall === 'undefined') {
    return <></>;
  }

  return (
    <InstallManagerContext.Provider value={{ forceReinstall }}>
      {children}
    </InstallManagerContext.Provider>
  );
};
