import React, { useState } from 'react';
import {
  createStyles,
  Theme,
  makeStyles
} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import {
  AppBar,
  Button,
  IconButton,
  Modal,
  Switch,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import db from '@act/data/web';
import { Checkin } from 'libs/data/core/src/lib/schema/checkin';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Achievement, User } from '@act/data/core';
import AddIcon from '@material-ui/icons/Add';

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

const usersColumns: GridColDef[] = [
  {
    field: 'username',
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

const Checkins = ({ open, onDismiss }) => {
  const classes = useStyles();

  let checkins: Checkin[] = db.useCollection('checkins', ['name']);
  let achievements: Achievement[] = db.useCollection('achievements', [
    'name'
  ]);
  let users: User[] = db.useCollection('users', ['name']);

  // db.get.collections
  //   .get<Checkin>('checkins')
  //   .query()
  //   .fetch()
  //   .then((cs) =>
  //     cs.forEach(async (c) => {
  //       c.achievements.fetch().then((a) => {
  //         console.log({ checkin: c._raw, achievements: a });
  //       });
  //     })
  //   );

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
      <Modal
        open={open}
        onClose={onDismiss}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={{
            backgroundColor: 'white',
            top: 0,
            position: 'absolute',
            width: 1000,
            left: '50%',
            marginLeft: -500,
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <h1 className={classes.addCheckinHeader}>Add Checkin</h1>
          <div style={{ display: 'flex' }}>
            <TextField
              id="filled-basic"
              label="Note"
              variant="filled"
              style={{ width: '100%', margin: 10, marginRight: 0 }}
            />
            <FormControlLabel
              style={{ margin: 10, marginLeft: 0 }}
              control={
                <Switch
                  checked={false}
                  onChange={() => {}}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Approved"
            />
          </div>
          <div style={{ flex: 1, overflow: 'scroll' }}>
            <div style={{ padding: 20 }}>
              <h2>Achievements</h2>
              <DataGrid
                editMode="client"
                rows={achievements}
                columns={columns}
                onEditCellChangeCommitted={
                  handleEditCellChangeCommitted
                }
                pageSize={5}
                checkboxSelection
                autoHeight={true}
              />
            </div>
            <div style={{ padding: 20 }}>
              <h2>Users</h2>
              <DataGrid
                editMode="client"
                rows={users}
                columns={usersColumns}
                onEditCellChangeCommitted={
                  handleEditCellChangeCommitted
                }
                pageSize={5}
                checkboxSelection
                autoHeight={true}
              />
            </div>
          </div>
          <AppBar position="static">
            <Toolbar
              style={{
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div style={{ alignSelf: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="default"
                  startIcon={<AddIcon />}
                  onClick={() => {}}
                >
                  Add Checkin
                </Button>
                <Button
                  style={{ alignSelf: 'flex-end', marginLeft: 10 }}
                  variant="contained"
                  color="default"
                  startIcon={<CancelIcon />}
                  onClick={onDismiss}
                >
                  Cancel
                </Button>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      </Modal>
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

export default Checkins;
