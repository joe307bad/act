import React, { useEffect } from 'react';
import {
  createStyles,
  Theme,
  makeStyles
} from '@material-ui/core/styles';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import db from '@act/data/web';
import { Checkin } from '@act/data/core';
import { CreateCheckin } from '../shared/components/CreateCheckin';

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

  const [personName, setPersonName] = React.useState([]);
  const handleChange = (event) => {
    setPersonName(event.target.value);
  };

  const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder'
  ];

  return (
    <>
      <CreateCheckin onDismiss={onDismiss} open={open} />
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
    </>
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
