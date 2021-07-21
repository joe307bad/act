import React, { useContext, useEffect } from 'react';
import { User } from '@act/data/core';
import db from '@act/data/web';
import { CheckinContext } from '../context/CheckinContext';
import { HeaderWithTags } from './HeaderWithTags';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { difference } from 'lodash';

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

export const CheckinUserSelector = () => {
  const users: User[] = db.useCollection('users', ['name']);
  const { model } = useContext(CheckinContext);
  const { users: selectedUsers } = model;

  return (
    <>
      <HeaderWithTags
        title="Users"
        selected={selectedUsers.get}
        onChange={selectedUsers.set}
      />
      <div style={{ height: 'calc(100% - 75px)' }}>
        <DataGrid
          editMode="client"
          rows={users}
          columns={usersColumns}
          selectionModel={Array.from(selectedUsers.get.keys())}
          onSelectionModelChange={({ selectionModel }) => {
            users.length &&
              selectedUsers.set(
                new Map(
                  selectionModel.map((nsm) => {
                    const u = users.find((a) => a.id === nsm);
                    return [
                      nsm.toString(),
                      { id: u.id, name: u.username }
                    ];
                  })
                )
              );
          }}
          pageSize={5}
          checkboxSelection
        />
      </div>
    </>
  );
};
