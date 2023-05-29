import React, { FC } from 'react';

import * as Icons from '@mui/icons-material';
import db from '@act/data/web';
import { SelectAchievementsAndUsers } from './components/SelectAchievementsAndUsers';
import {
  CheckinContext,
  CheckinProvider
} from './context/CheckinContext';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import {
  AppBar,
  Button,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Toolbar
} from '@mui/material';
import {
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';

type CheckinProps = {
  onDismiss: () => void;
  selectedCheckin?: string;
};

export const Checkin: FC<CheckinProps> = ({
  onDismiss,
  selectedCheckin
}) => {
  const classes = useStyles();

  return (
    <DatabaseProvider database={db.get}>
      <CheckinProvider>
        <CheckinContext.Consumer>
          {({ model }) => {
            const { note, approved, users, achievements } = model;
            const achievementCounts = new Map(
              Array.from(achievements.get).map(([key, value]) => [
                key,
                value?.count
              ])
            );
            const onSumbit = () => {
              selectedCheckin
                ? db.models.checkins.edit({
                    id: selectedCheckin,
                    editProps: {
                      note: note.get,
                      approved: approved.get
                    },
                    achievementCounts,
                    users: users.get
                  })
                : db.models.checkins.create({
                    insertProps: {
                      note: note.get,
                      approved: approved.get
                    },
                    achievementCounts,
                    users: Array.from(users.get.keys())
                  });
            };
            return (
              <Paper
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                elevation={3}
              >
                <h2 className={classes.addCheckinHeader}>
                  {selectedCheckin ? 'Edit Checkin' : 'Add Checkin'}
                </h2>
                <div style={{ display: 'flex' }}>
                  <TextField
                    id="filled-basic"
                    label="Note"
                    variant="filled"
                    value={note.get}
                    onChange={(e) => note.set(e.target.value)}
                    style={{
                      width: '100%',
                      margin: 10,
                      marginRight: 0
                    }}
                  />
                  <FormControlLabel
                    style={{ margin: 10, marginLeft: 0 }}
                    control={
                      <Switch
                        checked={model.approved.get}
                        onChange={(e) =>
                          approved.set(e.target.checked)
                        }
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label="Approved"
                  />
                </div>
                <SelectAchievementsAndUsers
                  selectedCheckin={selectedCheckin}
                />
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
                        color="primary"
                        startIcon={
                          selectedCheckin ? (
                            <Icons.Save />
                          ) : (
                            <Icons.Add />
                          )
                        }
                        onClick={() => {
                          onSumbit();
                          onDismiss();
                        }}
                      >
                        {selectedCheckin
                          ? 'Save Checkin'
                          : 'Add Checkin'}
                      </Button>
                      <Button
                        style={{
                          alignSelf: 'flex-end',
                          marginLeft: 10
                        }}
                        variant="contained"
                        color="primary"
                        startIcon={<Icons.Cancel />}
                        onClick={onDismiss}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Toolbar>
                </AppBar>
              </Paper>
            );
          }}
        </CheckinContext.Consumer>
      </CheckinProvider>
    </DatabaseProvider>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300
    },
    addCheckinHeader: {
      backgroundColor: theme.palette.primary.main,
      margin: 0,
      color: 'white',
      padding: 20
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
