import React, { useEffect, useState } from 'react';
import {
  createStyles,
  Theme,
  makeStyles
} from '@material-ui/core/styles';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import db from '@act/data/web';
import { AchievementCategory, Checkin } from '@act/data/core';
import { CreateCheckin } from '../shared/components/CreateCheckin';
import { GridContainer } from '../shared/components/TableContainer';
import { IconButton, MenuItem, Select } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const Checkins = ({ open, onDismiss }) => {
  const classes = useStyles();

  let checkins: Checkin[] = db.useCollection('checkins', ['name']);

  useEffect(() => {
    db.get.collections
      .get<Checkin>('checkins')
      .query()
      .fetch()
      .then((cs) => {
        console.log(
          cs.map(async (c) => ({
            checkin: c._raw,
            achievements: await c.achievements.fetch()
          }))
        );
      });
  }, [checkins]);

  const handleEditCellChangeCommitted = React.useCallback(
    async ({ id, field, props }) =>
      db.models.checkins.update(id, props.value),
    [checkins]
  );

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <GridContainer>
        {open ? (
          <CreateCheckin onDismiss={onDismiss} />
        ) : (
          <DataGrid
            editMode="client"
            rows={checkins}
            columns={columns}
            onEditCellChangeCommitted={handleEditCellChangeCommitted}
            pageSize={100}
            checkboxSelection
          />
        )}
      </GridContainer>
    </main>
  );
};

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
          onClick={() => db.models.communities.delete(id)}
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
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300
    },
    toolbar: theme.mixins.toolbar,
    addCheckinHeader: {
      backgroundColor: theme.palette.primary.main,
      margin: 0,
      padding: 20,
      color: 'white'
    },

    chips: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    chip: {
      margin: 2
    }
  })
);
export default Checkins;
