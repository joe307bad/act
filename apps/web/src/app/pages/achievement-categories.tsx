import React from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import db from '@act/data/web';
import { GridContainer } from '../shared/components/TableContainer';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
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
    field: '',
    filterable: false,
    width: 200,
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ id }) => {
      return (
        <IconButton
          onClick={() => db.models.achievementCategories.delete(id)}
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

const AchievementCategories = () => {
  const classes = useStyles();

  let achievementCategories: any[] = db.useCollection(
    'achievement_categories',
    ['name']
  );

  const handleEditCellChangeCommitted = React.useCallback(
    async ({ id, field, props }) =>
      db.models.achievementCategories.update(id, props.value),
    [achievementCategories]
  );

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <GridContainer>
        <DataGrid
          rows={achievementCategories}
          columns={columns}
          checkboxSelection
        />
      </GridContainer>
    </main>
  );
};

export default AchievementCategories;
