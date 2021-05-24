import React from 'react';
import {
  createStyles,
  Theme,
  makeStyles
} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { IconButton } from '@material-ui/core';
import { db } from '@act/data/web';

const columns = (deleteCommunity): GridColDef[] => {
  return [
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
            onClick={() => deleteCommunity(id)}
            aria-label="delete"
            color="secondary"
          >
            <DeleteIcon />
          </IconButton>
        );
      }
    }
  ];
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
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          editMode="client"
          rows={communities}
          columns={columns(db.models.communities.delete)}
          onEditCellChangeCommitted={handleEditCellChangeCommitted}
          pageSize={5}
          checkboxSelection
        />
      </div>
    </main>
  );
};

export default Communities;
