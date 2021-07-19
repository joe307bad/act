import React, { FC } from 'react';
import * as MUI from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import db from '@act/data/web';
import { SelectAchievementsAndUsers } from './components/SelectAchievementsAndUsers';
import {
  CheckinContext,
  CheckinProvider
} from './context/CheckinContext';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';

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
          {({ model, removedUsers, removedAchievements }) => {
            const { note, approved, users, achievements } = model;
            const achievementCounts = new Map(
              Array.from(achievements.get).map(([key, value]) => [
                key,
                value?.count
              ])
            );
            const onSumbit = () => {
              selectedCheckin
                ? db.models.checkins.edit(
                    selectedCheckin,
                    {
                      note: note.get,
                      approved: approved.get
                    },
                    achievementCounts,
                    removedAchievements.get,
                    Array.from(users.get.keys()),
                    removedUsers.get
                  )
                : db.models.checkins.create(
                    {
                      note: note.get,
                      approved: approved.get
                    },
                    achievementCounts,
                    Array.from(users.get.keys())
                  );
            };
            return (
              <MUI.Paper
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
                  <MUI.TextField
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
                  <MUI.FormControlLabel
                    style={{ margin: 10, marginLeft: 0 }}
                    control={
                      <MUI.Switch
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
                <MUI.AppBar position="static">
                  <MUI.Toolbar
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ alignSelf: 'flex-end' }}>
                      <MUI.Button
                        variant="contained"
                        color="default"
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
                      </MUI.Button>
                      <MUI.Button
                        style={{
                          alignSelf: 'flex-end',
                          marginLeft: 10
                        }}
                        variant="contained"
                        color="default"
                        startIcon={<Icons.Cancel />}
                        onClick={onDismiss}
                      >
                        Cancel
                      </MUI.Button>
                    </div>
                  </MUI.Toolbar>
                </MUI.AppBar>
              </MUI.Paper>
            );
          }}
        </CheckinContext.Consumer>
      </CheckinProvider>
    </DatabaseProvider>
  );
};

const useStyles = MUI.makeStyles((theme: MUI.Theme) =>
  MUI.createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300
    },
    toolbar: theme.mixins.toolbar,
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
