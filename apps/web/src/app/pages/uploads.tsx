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
import { GridContainer } from '../shared/components/TableContainer';

const columns: GridColDef[] = [
  {
    field: 'name',
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
          onClick={() => db.models.uploads.delete(id)}
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

const Uploads = () => {
  const classes = useStyles();

  let uploads: any[] = db.useCollection('uploads', ['name']);

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <GridContainer>
        <DataGrid
          editMode="client"
          rows={uploads}
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
      </GridContainer>
    </main>
  );
};

export default Uploads;
