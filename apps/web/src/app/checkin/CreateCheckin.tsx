import React, { FC, useEffect } from 'react';
import * as MUI from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import { Checkin } from '@act/data/core';
import db from '@act/data/web';
import { SelectAchievementsAndUsers } from './components/SelectAchievementsAndUsers';
import {
  CreateCheckinContext,
  CreateCheckinProvider
} from './context/CreateCheckinContext';

type CreateCheckinProps = {
  onDismiss: () => void;
  selectedCheckin?: Checkin;
};

export const CreateCheckin: FC<CreateCheckinProps> = ({
  onDismiss,
  selectedCheckin
}) => {
  const classes = useStyles();

  useEffect(() => {
    // selectedCheckin &&
    //   selectedCheckin.achievements
    //     .fetch()
    //     .then((cas) =>
    //       cas.map(async (ca) => {
    //         const a = await db.models.achievements._collection.query(
    //           Q.where('id', ca.achievementId)
    //         );
    //         return a[0];
    //       })
    //     )
    //     .then((a) => a.map(async (b) => console.log(await b)));
  }, []);

  if (!open) {
    return null;
  }

  return (
    <CreateCheckinProvider>
      <CreateCheckinContext.Consumer>
        {({ model }) => {
          const { note, approved, users, achievements } = model;
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
                Add Checkin
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
                      onChange={(e) => approved.set(e.target.checked)}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label="Approved"
                />
              </div>
              <SelectAchievementsAndUsers />
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
                      startIcon={<Icons.Add />}
                      onClick={() => {
                        db.models.checkins.create(
                          {
                            note: note.get,
                            approved: approved.get
                          },
                          new Map(
                            Array.from(achievements.get).map(
                              ([key, value]) => [key, value.count]
                            )
                          ),
                          Array.from(users.get.keys())
                        );
                        onDismiss();
                      }}
                    >
                      Add Checkin
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
      </CreateCheckinContext.Consumer>
    </CreateCheckinProvider>
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
