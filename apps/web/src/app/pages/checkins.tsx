import React, { createContext, useContext, useState } from 'react';
import {
  createStyles,
  Theme,
  makeStyles
} from '@material-ui/core/styles';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import db from '@act/data/web';
import { Checkin } from '@act/data/core';
import { CreateCheckin } from '../checkin/CreateCheckin';
import { GridContainer } from '../shared/components/TableContainer';
import * as MUI from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import { Q } from '@nozbe/watermelondb';

const CheckinContext =
  createContext<
    [
      selectedCheckin: Checkin,
      setSelectedCheckin: React.Dispatch<
        React.SetStateAction<Checkin>
      >,
      openCheckin: () => void
    ]
  >(undefined);

const Checkins = ({ open, openCheckin, onDismiss }) => {
  const classes = useStyles();

  let checkins: Checkin[] = db.useCollection('checkins', ['name']);
  const [selectedCheckin, setSelectedCheckin] =
    useState<Checkin | undefined>();

  const handleEditCellChangeCommitted = React.useCallback(
    async ({ id, field, props }) =>
      db.models.checkins.update(id, props.value),
    [checkins]
  );
  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <CheckinContext.Provider
        value={[selectedCheckin, setSelectedCheckin, openCheckin]}
      >
        <GridContainer>
          {open ? (
            <CreateCheckin
              onDismiss={() => {
                onDismiss();
                setSelectedCheckin(undefined);
              }}
              selectedCheckin={selectedCheckin}
            />
          ) : (
            <DataGrid
              editMode="client"
              rows={checkins}
              columns={columns}
              onEditCellChangeCommitted={
                handleEditCellChangeCommitted
              }
              pageSize={100}
              checkboxSelection
            />
          )}
        </GridContainer>
      </CheckinContext.Provider>
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
      const [_, setSelectedCheckin, openCheckin] =
        useContext(CheckinContext);

      const editCheckin = async (checkinId: string) => {
        // const checkin = await db.get.collections
        //   .get<Checkin>('checkins')
        //   .query(Q.where('id', checkinId))
        //   .fetch();
        // setSelectedCheckin(checkin[0]);
        // openCheckin();
      };

      return (
        <>
          <MUI.IconButton
            onClick={() => db.models.communities.delete(id)}
            aria-label="delete"
            color="secondary"
          >
            <Icons.Delete />
          </MUI.IconButton>
          <MUI.IconButton
            onClick={() => editCheckin(id.toString())}
            aria-label="delete"
            color="secondary"
          >
            <Icons.Edit />
          </MUI.IconButton>
        </>
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
