import React, { FC, useContext, useEffect } from 'react';
import {
  Achievement,
  AchievementCategory,
  User
} from '@act/data/core';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import db from '@act/data/web';
import { HeaderWithTags } from './HeaderWithTags';
import { CheckinContext } from '../context/CheckinContext';
import { TabPanel } from '../../shared/components/TabPanel';
import { SelectAchievementCount } from './SelectAchievementCount';
import { categoryOperators } from '../../shared/components/CategoryFilter';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { Q } from '@nozbe/watermelondb';
import { of } from 'rxjs';
import { CheckinUserSelector } from './CheckinUserSelector';
import { AppBar, Paper, Tab, Tabs } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid/models/gridRowSelectionModel';
import { GridCallbackDetails } from '@mui/x-data-grid/models/api';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200
  },
  {
    field: 'created_at',
    headerName: 'Created',
    width: 200
  },
  {
    field: 'points',
    headerName: 'Points'
  },
  {
    field: 'category_id',
    headerName: 'Category',
    width: 200,
    type: 'string',
    valueGetter: ({ value }) => value ?? '',
    renderCell: ({ value }) => {
      return (
        <span>
          {db
            .useCollection<AchievementCategory>(
              'achievement_categories'
            )
            .find((ac) => ac.id === value)?.name ?? ''}
        </span>
      );
    }
  },
  {
    field: 'id',
    headerName: 'Count',
    renderCell: ({ id }) => {
      const { achievementCounts } = useContext(CheckinContext);
      return (
        <SelectAchievementCount
          id={id}
          value={achievementCounts.get.get(id.toString())}
        />
      );
    }
  }
];

export const SelectAchievementsAndUsersComponent = ({
  checkin,
  achievements: savedAchievements,
  users: savedUsers
}) => {
  const achievements: Achievement[] = db.useCollection(
    'achievements',
    ['name']
  );
  const users: User[] = db.useCollection('users', ['username']);
  const [activeTab, setActiveTab] = React.useState(0);
  const { model, achievementCounts } = useContext(CheckinContext);
  const { achievements: selectedAchievements, users: selectedUsers } =
    model;

  useEffect(() => {
    if (!checkin || achievements.length === 0 || users.length === 0) {
      return;
    }
    const newAchievementCounts: Map<string, number> = new Map(
      savedAchievements.map((sa) => [
        sa.achievementId,
        sa.count === 0 ? 1 : sa.count
      ])
    );

    model.achievements.set(
      new Map(
        Array.from(newAchievementCounts).map(
          (value, index, array) => {
            const a: Achievement & { count?: number } =
              achievements.find((a) => a.id === value[0]);
            a.count = value[1];
            return [value[0], a];
          }
        )
      )
    );
    achievementCounts.set(newAchievementCounts);

    console.log(savedUsers);
    selectedUsers.set(
      new Map(
        savedUsers.map((su) => {
          const u = users.find((us) => us.id === su.userId);
          return [su.userId, { name: u.username }];
        })
      )
    );

    model.note.set(checkin.note);
    model.approved.set(checkin.approved);
  }, [checkin, achievements, users]);

  const handleEditCellChangeCommitted = React.useCallback(
    async (newRow, oldRow) =>
      db.models.checkins.update(oldRow.id, newRow.name),
    [achievements]
  );

  if (columns.length > 0) {
    const categoryColumn = columns.find(
      (col) => col.field === 'category_id'
    );
    const newCategoryColumn = {
      ...categoryColumn,
      filterOperators: categoryOperators
    };

    const categoryColIndex = columns.findIndex(
      (col) => col.field === 'category_id'
    );

    columns[categoryColIndex] = newCategoryColumn;
  }

  return (
    <Paper style={{ margin: 20, flex: 1 }} variant="outlined">
      <AppBar position="static">
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          aria-label="simple tabs example"
        >
          <Tab
            label={`Achievements${
              selectedAchievements.get.size > 0
                ? ` (${selectedAchievements.get.size})`
                : ''
            }`}
          />
          <Tab
            label={`Users${
              selectedUsers.get.size > 0
                ? ` (${selectedUsers.get.size})`
                : ''
            }`}
          />
        </Tabs>
      </AppBar>
      <TabPanel
        value={activeTab}
        style={{ height: '100%' }}
        index={0}
      >
        <>
          <HeaderWithTags
            title="Achievements"
            selected={Array.from(selectedAchievements.get)}
            onChange={selectedAchievements.set}
            showCount={true}
          />
          <div style={{ height: 'calc(100% - 75px)' }}>
            <DataGrid
              rows={achievements as any}
              processRowUpdate={handleEditCellChangeCommitted}
              rowSelectionModel={Array.from(
                selectedAchievements.get.keys()
              )}
              onRowSelectionModelChange={(
                selectionModel: GridRowSelectionModel,
                details: GridCallbackDetails
              ) => {
                const sa = selectionModel.reduce((acc, nsm) => {
                  const a = achievements.find((a) => a.id === nsm);

                  if (!a) {
                    return acc;
                  }
                  acc.push([
                    nsm.toString(),
                    {
                      id: a.id,
                      name: a.name,
                      points: a.points,
                      count: achievementCounts.get.get(a.id) ?? 1
                    }
                  ]);
                  return acc;
                }, []);
                selectedAchievements.set(new Map(sa));
              }}
              columns={columns}
              checkboxSelection
            />
          </div>
        </>
      </TabPanel>
      <TabPanel
        value={activeTab}
        style={{ height: '100%' }}
        index={1}
      >
        <CheckinUserSelector existingUsers={users} />
      </TabPanel>
    </Paper>
  );
};

export const SelectAchievementsAndUsers: FC<{
  selectedCheckin?: string;
}> = withDatabase(
  withObservables(
    ['selectedCheckin', 'database'],
    ({ selectedCheckin, database }) => {
      if (!selectedCheckin) {
        return {
          checkin: of(null),
          achievements: of(null),
          users: of(null)
        };
      }
      return {
        checkin: database.collections
          .get('checkins')
          .findAndObserve(selectedCheckin),
        achievements: database.collections
          .get('checkin_achievements')
          .query(Q.where('checkin_id', selectedCheckin))
          .observe(),
        users: database.collections
          .get('checkin_users')
          .query(Q.where('checkin_id', selectedCheckin))
          .observe()
      };
    }
  )(SelectAchievementsAndUsersComponent)
);
