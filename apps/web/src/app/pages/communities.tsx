import React from 'react';
import {
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import db from '@act/data/web';
import { GridContainer } from '../shared/components/TableContainer';

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
    renderCell: ({ id }) => {
      return (
        <IconButton
          onClick={() => db.models.communities.delete(id)}
          aria-label="delete"
          color="secondary"
          size="large">
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

const Communities = () => {
  const classes = useStyles();

  let communities: any[] = db.useCollection('communities', ['name']);

  const handleEditCellChangeCommitted = React.useCallback(
    async ({ id, field, props }) =>
      db.models.communities.update(id, props.value),
    [communities]
  );

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <GridContainer>
        <DataGrid
          rows={communities}
          columns={columns}
          checkboxSelection
        />
      </GridContainer>
    </main>
  );
};

export default Communities;
