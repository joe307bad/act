import React from 'react';
import { Paper } from '@mui/material';

export const GridContainer = ({ children }) => {
  return (
    <Paper style={{ height: 'calc(100% - 70px)' }}>
      <div style={{ width: '100%', height: '100%' }}>{children}</div>
    </Paper>
  );
};
