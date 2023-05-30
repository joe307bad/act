import React, { useState } from 'react';
import {
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, MenuItem, Select } from '@mui/material';
import db from '@act/data/web';
import { GridContainer } from '../shared/components/TableContainer';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 200
  },
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
    field: 'admin',
    headerName: 'Admin',
    width: 200,
    editable: false,
    renderCell: ({ id, value }) => {
      return <SelectAdmin id={id} value={value} />;
    }
  },
  {
    field: '',
    filterable: false,
    width: 200,
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ id }) => {
      return (
        <IconButton
          onClick={() => db.models.users.delete(id)}
          aria-label="delete"
          color="secondary"
          size="large"
        >
          <DeleteIcon />
        </IconButton>
      );
    }
  }
];
const SelectAdmin = ({ id, value }) => {
  const [v, setValue] = useState(value.toString());

  const actualValue = (() => {
    if (v === 'false') {
      return value;
    }

    return v;
  })();

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    db.models.users.updateWithProps(id, {
      admin: newValue === 'true'
    });
  };

  return (
    <Select
      style={{ flex: 1 }}
      value={actualValue === 'true' ? 'true' : ('false' as any)}
      onChange={handleChange}
    >
      <MenuItem value={'false'}>False</MenuItem>
      <MenuItem value={'true'}>True</MenuItem>
    </Select>
  );
};
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
    async ({ full_name, username, keycloak_id, admin }, oldRow) => {
      await db.models.users.updateWithProps(oldRow.id, {
        full_name,
        username,
        keycloak_id,
        admin
      });

      return { full_name, username, keycloak_id, admin, ...oldRow };
    },
    [users]
  );

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <GridContainer>
        <DataGrid
          rows={users}
          columns={columns}
          processRowUpdate={handleEditCellChangeCommitted}
          checkboxSelection
        />
      </GridContainer>
    </main>
  );
};

export default Users;
