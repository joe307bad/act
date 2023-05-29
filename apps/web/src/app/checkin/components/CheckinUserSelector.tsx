import React, { useContext } from 'react';
import { CheckinContext } from '../context/CheckinContext';
import { HeaderWithTags } from './HeaderWithTags';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const usersColumns: GridColDef[] = [
  {
    field: 'username',
    headerName: 'Name',
    width: 200
  },
  {
    field: 'created_at',
    headerName: 'Created',
    width: 200
  }
];

export const CheckinUserSelector = ({ existingUsers }) => {
  const { model } = useContext(CheckinContext);
  const { users: selectedUsers } = model;

  return (
    <>
      <HeaderWithTags
        title="Users"
        selected={Array.from(selectedUsers.get)}
        onChange={selectedUsers.set}
      />
      <div style={{ height: 'calc(100% - 75px)' }}>
        <DataGrid
          rows={existingUsers}
          columns={usersColumns}
          checkboxSelection
        />
      </div>
    </>
  );
};
