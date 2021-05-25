import React, { useState } from 'react';
import {
  createStyles,
  Theme,
  makeStyles
} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { IconButton, NativeSelect, Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import db from '@act/data/web';
import { Achievement, AchievementCategory } from '@act/data/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar,
    root: {
      display: 'flex'
    }
  })
);
const SelectCategory = ({ id, value }) => {
  const [v, setValue] = useState(null);

  const actualValue = (() => {
    if (v === null) {
      return value ?? 0;
    }

    return v;
  })();

  const achievementCategories = db.useCollection<AchievementCategory>(
    'achievement_categories'
  );

  const handleChange = (event) => {
    setValue(event.target.value);
    db.models.achievements.updateRelation(
      id,
      'category',
      event.target.value
    );
  };

  return (
    <Select
      style={{ flex: 1 }}
      value={actualValue}
      onChange={handleChange}
    >
      <MenuItem value={0}>No Category</MenuItem>
      {achievementCategories.map((ac, i) => (
        <MenuItem key={i} value={ac.id}>
          {ac.name}
        </MenuItem>
      ))}
    </Select>
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
    field: 'category_id',
    headerName: 'Category',
    editable: false,
    width: 200,
    disableClickEventBubbling: true,
    renderCell: ({ id, value }) => {
      return <SelectCategory id={id} value={value} />;
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

const Achievements = () => {
  const classes = useStyles();

  let achievements = db.useCollection<Achievement>('achievements', [
    'name',
    'category'
  ]);

  const handleEditCellChangeCommitted = React.useCallback(
    async ({ id, field, props }) =>
      db.models.achievements.updateWithProps(id, {
        name: props.value
      }),
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
          //onEditCellChangeCommitted={handleEditCellChangeCommitted}
          pageSize={5}
          checkboxSelection
        />
      </div>
    </main>
  );
};

export default Achievements;
