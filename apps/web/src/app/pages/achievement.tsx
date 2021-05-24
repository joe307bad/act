import React from 'react';
import {
  createStyles,
  Theme,
  makeStyles
} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { IconButton, Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import db from '@act/data/web';

const columns: GridColDef[] = [
  {
    field: 'name',
    editable: true,
    headerName: 'Name',
    width: 200
  },
  {
    field: 'created_at',
    headerName: 'Created',
    width: 200
  },
  {
    field: 'category_id',
    headerName: 'Category',
    editable: true,
    width: 200,
    renderEditCell: (params) => {
      return (
        <Select value={10} onChange={() => {}}>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      );
    }
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
          onClick={() => db.models.achievements.delete(id)}
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

const Achievements = () => {
  const classes = useStyles();

  let achievements: any[] = db.useCollection('achievements', [
    'name'
  ]);

  const handleEditCellChangeCommitted = React.useCallback(
    async ({ id, field, props }) =>
      db.models.achievements.update(id, props.value),
    [achievements]
  );

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          editMode="client"
          rows={achievements}
          columns={columns}
          onEditCellChangeCommitted={handleEditCellChangeCommitted}
          pageSize={5}
          checkboxSelection
        />
      </div>
    </main>
  );
};

export default Achievements;
