import React from 'react';
import {
  createStyles,
  Theme,
  makeStyles
} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { IconButton } from '@material-ui/core';
import db from '@act/data/web';

const columns: GridColDef[] = [
  {
    field: 'full_name',
    editable: true,
    headerName: 'Full Name',
    width: 200
  },
  {
    field: 'username',
    editable: true,
    headerName: 'Username',
    width: 200
  },
  {
    field: 'keycloak_id',
    headerName: 'Keycloak ID',
    width: 200
  },
  {
    field: 'created_at',
    headerName: 'Created',
    width: 200
  },
  {
    field: '',
    filterable: false,
    width: 200,
    disableColumnMenu: true,
    sortable: false,
    disableClickEventBubbling: true,
    renderCell: ({ id }) => {
      return (
        <IconButton
          onClick={() => db.models.users.delete(id)}
          aria-label="delete"
          color="secondary"
        >
          <DeleteIcon />
        </IconButton>
      );
    }
  }
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar
  })
);

const Users = () => {
  const classes = useStyles();

  let users: any[] = db.useCollection('users', ['full_name']);

  const handleEditCellChangeCommitted = React.useCallback(
    async ({ field, id, props }) => {
      return db.models.users.updateWithProps(id, {
        [field]: props.value
      });
    },
    [users]
  );

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          editMode="client"
          rows={users}
          columns={columns}
          onEditCellChangeCommitted={handleEditCellChangeCommitted}
          pageSize={5}
          checkboxSelection
        />
      </div>
    </main>
  );
};

export default Users;
