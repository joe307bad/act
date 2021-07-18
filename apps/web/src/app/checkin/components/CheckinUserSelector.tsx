import React, { FC, useContext, useEffect } from 'react';
import { User } from '@act/data/core';
import db from '@act/data/web';
import { CreateCheckinContext } from '../context/CreateCheckinContext';
import { HeaderWithTags } from './HeaderWithTags';
import { DataGrid, GridColDef } from '@material-ui/data-grid';

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
  const { model } = useContext(CreateCheckinContext);
  const { users: selectedUsers } = model;

  useEffect(() => {
    if (!users.length) {
      return;
    }
    selectedUsers.set(
      new Map(
        Array.from(selectedUsers.get).map(([userId]) => {
          const user = users.find((u) => u.id === userId);
          return [userId, { id: user.id, name: user.username }];
        })
      )
    );
  }, [users]);

  return (
    <>
      <HeaderWithTags
        title="Users"
        selected={selectedUsers.get}
        setSelected={selectedUsers.set}
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
                    debugger;
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
