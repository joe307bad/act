import { format } from 'date-fns';

export const formatTimestamp = (timestamp: number) =>
  format(timestamp, 'EEE MMM do @ pp');
