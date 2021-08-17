import { Platform } from 'react-native';

export const getDefaultFont = () =>
  Platform.OS === 'ios' ? 'Arial' : 'sans-serif';
