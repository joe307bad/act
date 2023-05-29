import React, { useContext } from 'react';
import { CheckinContext } from '../context/CheckinContext';
import { HeaderWithTags } from './HeaderWithTags';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {GridRowSelectionModel} from "@mui/x-data-grid/models/gridRowSelectionModel";
import {GridCallbackDetails} from "@mui/x-data-grid/models/api";

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
          rowSelectionModel={Array.from(selectedUsers.get.keys())}
          onRowSelectionModelChange={(
            selectionModel: GridRowSelectionModel,
            details: GridCallbackDetails
          ) => {
            existingUsers.length &&
            selectedUsers.set(
              new Map(
                selectionModel.map((nsm) => {
                  const u = existingUsers.find((a) => a.id === nsm);
                  return [
                    nsm.toString(),
                    { id: u.id, name: u.username }
                  ];
                })
              )
            );
          }}
          checkboxSelection
        />
      </div>
    </>
  );
};
