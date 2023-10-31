import React, {
  FC,
  createContext,
  useRef,
  useContext,
  useState
} from 'react';
import db, { useActAuth } from './index';
import { useEnvironment } from './EnvironmentProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Bugsnag from '@bugsnag/react-native';

export const SyncProviderContext = createContext<{
  sync: () => Promise<{ rejectSyncGracefully?: boolean }>;
  lastPulledAt: number | undefined;
  syncStatus: SyncStatus;
}>(undefined);

export const useSync = () => useContext(SyncProviderContext);

type SyncStatus = 'PROCESSING' | 'SUCCESS' | 'FAILURE' | 'INITIAL';

export const SyncProvider: FC<{ children: JSX.Element }> = ({
  children
}) => {
  const syncProcessing = useRef(false);
  const { apiUrl } = useEnvironment();
  const [lastPulledAt, setLastPulledAt] = useState<number>();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('INITIAL');
  const { currentUser } = useActAuth();
  const sync = (retryCount = 0) => {
    if (syncProcessing.current && retryCount === 0) {
      return Promise.resolve({ rejectSyncGracefully: true });
    }
    syncProcessing.current = true;
    setSyncStatus('PROCESSING');

    return db
      .sync(apiUrl)
      .then((lpa) => {
        if (Number.isInteger(lpa)) {
          AsyncStorage.setItem('lastPulledAt', lpa.toString());
          setLastPulledAt(lpa);
        }
      })
      .then(() => {
        syncProcessing.current = false;
        setSyncStatus('SUCCESS');
        return Promise.resolve({ rejectSyncGracefully: false });
      })
      .catch((err) => {
        if (retryCount === 0) {
          return sync(1);
        } else {
          syncProcessing.current = false;
          setSyncStatus('FAILURE');
          Bugsnag.notify(
            new Error(
              `Sync failed for ${currentUser.username} ${currentUser.id}`
            ),
            (e) => {
              e.addMetadata('errorFromCatch', err?.toString());
            }
          );
          return Promise.resolve({ rejectSyncGracefully: true });
        }
      });
  };
  return (
    <SyncProviderContext.Provider
      value={{ sync, lastPulledAt, syncStatus }}
    >
      {children}
    </SyncProviderContext.Provider>
  );
};
