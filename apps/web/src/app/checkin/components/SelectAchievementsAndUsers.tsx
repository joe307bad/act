import React, { FC, useContext, useEffect, useState } from 'react';
import * as MUI from '@material-ui/core';
import {
  Achievement,
  AchievementCategory,
  Checkin,
  User
} from '@act/data/core';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import db from '@act/data/web';
import { HeaderWithTags } from './HeaderWithTags';
import { CreateCheckinContext } from '../context/CreateCheckinContext';
import { TabPanel } from '../../shared/components/TabPanel';
import { SelectAchievementCount } from './SelectAchievementCount';
import { categoryOperators } from '../../shared/components/CategoryFilter';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { Q } from '@nozbe/watermelondb';

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
    disableClickEventBubbling: true,
    renderCell: ({ id }) => {
      const { achievementCounts } = useContext(CreateCheckinContext);
      return (
        <SelectAchievementCount
          id={id}
          value={achievementCounts.get.get(id.toString())}
        />
      );
    }
  }
];

const usersColumns: GridColDef[] = [
  {
    field: 'username',
    headerName: 'Name',
    width: 200
  },
  {
    field: 'created_at',
    headerName: 'Created',
    width: 200
  }
];

export const SelectAchievementsAndUsersComponent = ({
  checkin,
  achievements: a
}) => {
  const achievements: Achievement[] = db.useCollection(
    'achievements',
    ['name']
  );
  const users: User[] = db.useCollection('users', ['name']);
  const [activeTab, setActiveTab] = React.useState(0);
  const { model, achievementCounts } = useContext(
    CreateCheckinContext
  );
  const { achievements: selectedAchievements, users: selectedUsers } =
    model;

  useEffect(() => {
    model.achievements.set(
      new Map(a.map((b) => [b.achievementId, null]))
    );
  }, [a]);

  const handleEditCellChangeCommitted = React.useCallback(
    async ({ id, field, props }) =>
      db.models.checkins.update(id, props.value),
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
    <MUI.Paper style={{ margin: 20, flex: 1 }} variant="outlined">
      <MUI.AppBar position="static">
        <MUI.Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          aria-label="simple tabs example"
        >
          <MUI.Tab
            label={`Achievements${
              selectedAchievements.get.size > 0
                ? ` (${selectedAchievements.get.size})`
                : ''
            }`}
          />
          <MUI.Tab
            label={`Users${
              selectedUsers.get.size > 0
                ? ` (${selectedUsers.get.size})`
                : ''
            }`}
          />
        </MUI.Tabs>
      </MUI.AppBar>
      <TabPanel
        value={activeTab}
        style={{ height: '100%' }}
        index={0}
      >
        <>
          <HeaderWithTags
            title="Achievements"
            selected={selectedAchievements.get}
            setSelected={selectedAchievements.set}
            showCount={true}
          />
          <div style={{ height: 'calc(100% - 75px)' }}>
            <DataGrid
              editMode="client"
              rows={achievements}
              columns={columns}
              onEditCellChangeCommitted={
                handleEditCellChangeCommitted
              }
              selectionModel={Array.from(
                selectedAchievements.get.keys()
              )}
              onSelectionModelChange={({ selectionModel }) => {
                selectedAchievements.set(
                  new Map(
                    selectionModel.map((nsm) => {
                      const a = achievements.find(
                        (a) => a.id === nsm
                      );
                      return [
                        nsm.toString(),
                        {
                          id: a.id,
                          name: a.name,
                          points: a.points,
                          count: achievementCounts.get.get(a.id) ?? 1
                        }
                      ];
                    })
                  )
                );
              }}
              pageSize={5}
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
        <HeaderWithTags
          title="Users"
          selected={selectedUsers.get}
          setSelected={selectedUsers.set}
        />
        <div style={{ height: 'calc(100% - 75px)' }}>
          <DataGrid
            editMode="client"
            rows={users}
            columns={usersColumns}
            selectionModel={Array.from(selectedUsers.get.keys())}
            onSelectionModelChange={({ selectionModel }) => {
              selectedUsers.set(
                new Map(
                  selectionModel.map((nsm) => {
                    const u = users.find((a) => a.id === nsm);
                    return [
                      nsm.toString(),
                      { id: u.id, name: u.username }
                    ];
                  })
                )
              );
            }}
            pageSize={5}
            checkboxSelection
          />
        </div>
      </TabPanel>
    </MUI.Paper>
  );
};

export const SelectAchievementsAndUsers: FC<{
  selectedCheckin: string;
}> = withDatabase(
  withObservables(
    ['selectedCheckin', 'database'],
    ({ selectedCheckin, database }) => {
      //debugger;
      return {
        checkin: database.collections
          .get('checkins')
          .findAndObserve(selectedCheckin),
        achievements: database.collections
          .get('checkin_achievements')
          .query(Q.where('checkin_id', selectedCheckin))
          .observe()
      };
    }
  )(SelectAchievementsAndUsersComponent)
);
