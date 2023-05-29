import React, { createContext, useContext, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import db from '@act/data/web';
import { Checkin } from '@act/data/core';
import { Checkin as CheckinDetails } from '../checkin';
import { GridContainer } from '../shared/components/TableContainer';
import {
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';

import * as Icons from '@mui/icons-material';
import {IconButton} from "@mui/material";

// @ts-ignore
window.db = db;

const CheckinContext =
  createContext<
    [
      selectedCheckin: string,
      setSelectedCheckin: React.Dispatch<
        React.SetStateAction<string>
      >,
      openCheckin: () => void
    ]
  >(undefined);

const Checkins = ({ open, openCheckin, onDismiss }) => {
  const classes = useStyles();

  let checkins: Checkin[] = db.useCollection('checkins', [
    'name',
    'approved'
  ]);
  const [selectedCheckin, setSelectedCheckin] =
    useState<string | undefined>();

  const handleEditCellChangeCommitted = React.useCallback(
    async (newRow, oldRow) =>
      db.models.checkins.update(oldRow.id, newRow.name),
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
            <CheckinDetails
              onDismiss={() => {
                onDismiss();
                setSelectedCheckin(undefined);
              }}
              selectedCheckin={selectedCheckin}
            />
          ) : (
            <DataGrid
              rows={checkins as any}
              columns={columns}
              processRowUpdate={handleEditCellChangeCommitted}
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
    field: 'id',
    headerName: 'Id',
    width: 200
  },
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
    field: 'approved',
    headerName: 'Approved',
    width: 200
  },
  {
    field: '',
    filterable: false,
    width: 200,
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ id }) => {
      const [_, setSelectedCheckin, openCheckin] =
        useContext(CheckinContext);

      const editCheckin = async (checkinId: string) => {
        setSelectedCheckin(checkinId);
        openCheckin();
      };

      return (
        <>
          <IconButton
            onClick={() => db.models.checkins.delete(id)}
            aria-label="delete"
            color="secondary"
          >
            <Icons.Delete />
          </IconButton>
          <IconButton
            onClick={() => editCheckin(id.toString())}
            aria-label="delete"
            color="secondary"
          >
            <Icons.Edit />
          </IconButton>
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
