import { useSettings } from '@act/data/rn';
import { Box, Column, Columns, Stack } from '@mobily/stacks';
import React from 'react';
import { Text } from 'react-native';
import { Surface } from 'react-native-paper';
import { Switch } from '../shared/components/Switch';

export const Settings = () => {
  const { settingsManager, toggleHideCameraFab } = useSettings();
  const { hideCameraFab } = settingsManager;

  return (
    <Stack>
      <Box padding={2}>
        <Surface style={{ elevation: 2 }}>
          <Columns padding={2} alignY="center">
            <Column>
              <Text>Toggle camera FAB</Text>
            </Column>
            <Column width="content">
              <Switch
                disableWhileSyncing={true}
                value={hideCameraFab}
                onPress={toggleHideCameraFab}
              />
            </Column>
          </Columns>
        </Surface>
      </Box>
    </Stack>
  );
};
