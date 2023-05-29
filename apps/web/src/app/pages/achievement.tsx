import React, { useState } from 'react';
import {
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DataGrid,
  GridColDef,
  GridEventListener
} from '@mui/x-data-grid';
import { IconButton, NativeSelect, Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import db from '@act/data/web';
import { Achievement, AchievementCategory } from '@act/data/core';
import { GridContainer } from '../shared/components/TableContainer';
import { isEmpty } from 'lodash';

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
    'achievement_categories',
    ['name']
  );

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    db.models.achievements.updateRelation(
      id,
      'category',
      newValue === 0 ? null : newValue
    );
  };

  return achievementCategories.length > 0 ? (
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
  ) : null;
};

const SelectEnabled = ({ id, value }) => {
  const [v, setValue] = useState(value);

  const handleChange = (event) => {
    const newValue = event.target.value === 'true';
    setValue(newValue);
    db.models.achievements.updateWithProps(id, {
      enabled: newValue
    });
  };

  return (
    <Select
      style={{ flex: 1 }}
      value={value ? 'true' : ('false' as any)}
      onChange={handleChange}
    >
      <MenuItem value={'true'}>Enabled</MenuItem>
      <MenuItem value={'false'}>Disabled</MenuItem>
    </Select>
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
    field: 'points',
    editable: true,
    headerName: 'Points',
    width: 200
  },
  {
    field: 'photo',
    editable: true,
    headerName: 'Photo',
    width: 200
  },
  {
    field: 'enabled',
    editable: false,
    headerName: 'Enabled',
    width: 200,
    renderCell: ({ id, value }) => {
      return <SelectEnabled id={id} value={value} />;
    }
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
    renderCell: ({ id }) => {
      return (
        <IconButton
          onClick={() => db.models.achievements.delete(id)}
          aria-label="delete"
          color="secondary"
          size="large"
        >
          <DeleteIcon />
        </IconButton>
      );
    }
  }
];

const Achievements = () => {
  const classes = useStyles();

  let achievements = db
    .useCollection<Achievement>('achievements', [
      'name',
      'category_id',
      'enabled',
      'photo',
      'points'
    ])
    .map((a) => {
      a.photo = isEmpty(a.photo) ? '' : a.photo;
      return a;
    });

  const handleEditCellChangeCommitted: (
    newRow: any,
    oldRow: any
  ) => any = React.useCallback(
    async (
      { id, name, category_id, points, photo, enabled },
      oldRow
    ) => {
      await db.models.achievements.updateWithProps(id, {
        name,
        category_id,
        points,
        photo,
        enabled
      });

      return {
        id,
        name,
        category_id,
        points,
        photo,
        enabled,
        ...oldRow
      };
    },
    [achievements]
  );

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <GridContainer>
        <DataGrid
          rows={achievements}
          columns={columns}
          processRowUpdate={handleEditCellChangeCommitted}
          checkboxSelection
        />
      </GridContainer>
    </main>
  );
};

export default Achievements;
