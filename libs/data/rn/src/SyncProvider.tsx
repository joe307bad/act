import React, { FC, createContext, useRef, useContext } from 'react';
import { useInstallManagerContext } from './InstallManagerProvider';
import db from './index';

const SyncProviderContext =
  createContext<() => Promise<{ rejectSyncGracefully?: boolean }>>(
    undefined
  );

export const useSync = () => useContext(SyncProviderContext);

export const SyncProvider: FC = ({ children }) => {
  const { forceReinstall } = useInstallManagerContext();
  const syncProcessing = useRef(false);

  const sync = (retryCount = 0) => {
    if (forceReinstall) {
      return Promise.resolve({ rejectSyncGracefully: true });
    }

    if (syncProcessing.current && retryCount === 0) {
      return Promise.resolve({ rejectSyncGracefully: true });
    }
    syncProcessing.current = true;

    return db
      .sync()
      .then(() => {
        syncProcessing.current = false;
        return Promise.resolve({ rejectSyncGracefully: false });
      })
      .catch(() => {
        if (retryCount === 0) {
          return sync(1);
        } else {
          syncProcessing.current = false;
          return Promise.resolve({ rejectSyncGracefully: true });
        }
      });
  };
  return (
    <SyncProviderContext.Provider value={sync}>
      {children}
    </SyncProviderContext.Provider>
  );
};
