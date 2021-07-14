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
import { Checkin } from 'libs/data/core/src/lib/schema/checkin';

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
    field: '',
    filterable: false,
    width: 200,
    disableColumnMenu: true,
    sortable: false,
    disableClickEventBubbling: true,
    renderCell: ({ id }) => {
      return (
        <IconButton
          onClick={() => db.models.checkins.delete(id)}
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

const Checkins = () => {
  const classes = useStyles();

  let checkins: Checkin[] = db.useCollection('checkins', ['name']);

  db.get.collections
    .get<Checkin>('checkins')
    .query()
    .fetch()
    .then((cs) =>
      cs.forEach(async (c) => {
        c.achievements.fetch().then((a) => {
          console.log({ checkin: c._raw, achievements: a });
        });
      })
    );

  const handleEditCellChangeCommitted = React.useCallback(
    async ({ id, field, props }) =>
      db.models.checkins.update(id, props.value),
    [checkins]
  );

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <div style={{ height: 1000, width: '100%' }}>
        <DataGrid
          editMode="client"
          rows={checkins}
          columns={columns}
          onEditCellChangeCommitted={handleEditCellChangeCommitted}
          pageSize={100}
          checkboxSelection
        />
      </div>
    </main>
  );
};

export default Checkins;
