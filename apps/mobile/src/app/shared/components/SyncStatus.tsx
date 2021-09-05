import React, { FC } from 'react';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type SyncStatus = 'PROCESSING' | 'SUCCESS' | 'FAILURE' | 'INITIAL';

export const SyncStatus: FC<{ status: SyncStatus }> = ({
  status
}) => {
  const theme = useTheme();
  switch (status) {
    case 'PROCESSING':
      return <ActivityIndicator />;
    case 'SUCCESS':
      return (
        <MaterialCommunityIcons
          name={`checkbox-marked-circle-outline`}
          color={theme.colors.primary}
          size={25}
        />
      );
    case 'FAILURE':
      return (
        <MaterialCommunityIcons
          name={`network-strength-1-alert`}
          color={theme.colors.error}
          size={25}
        />
      );
    case 'INITIAL':
      return null;
  }
};
