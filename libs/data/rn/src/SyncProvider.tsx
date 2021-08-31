import React, { FC, createContext, useRef, useContext } from 'react';
import db from './index';
import { useEnvironment } from './EnvironmentProvider';

export const SyncProviderContext =
  createContext<() => Promise<{ rejectSyncGracefully?: boolean }>>(
    undefined
  );

export const useSync = () => useContext(SyncProviderContext);

export const SyncProvider: FC = ({ children }) => {
  const syncProcessing = useRef(false);
  const { apiUrl } = useEnvironment();

  const sync = (retryCount = 0) => {
    if (syncProcessing.current && retryCount === 0) {
      return Promise.resolve({ rejectSyncGracefully: true });
    }
    syncProcessing.current = true;

    return db
      .sync(apiUrl)
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
