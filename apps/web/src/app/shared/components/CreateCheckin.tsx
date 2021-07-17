import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  createStyles,
  FormControl,
  FormControlLabel,
  InputLabel,
  makeStyles,
  MenuItem,
  NativeSelect,
  Paper,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Theme,
  Toolbar
} from '@material-ui/core';
import {
  Achievement,
  AchievementCategory,
  User
} from '@act/data/core';
import db from '@act/data/web';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import PlusIcon from '@material-ui/icons/Add';

type CreateCheckinProps = {
  onDismiss: () => void;
};

type SelectedItem = {
  id: string;
  points?: number;
  count?: number;
  name: string;
};

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
      const [achievementCounts] = useContext(CreatCheckinContext);
      return (
        <SelectAchievementCount
          id={id}
          value={achievementCounts.get(id.toString())}
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{ height: 'calc(100% - 48px)' }} p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SelectAchievementCount = ({ id, value }) => {
  const [v, setValue] = useState(value ?? 1);
  const [
    achievementCounts,
    setAchievementCounts,
    setSelectedAchievementCountById
  ] = useContext(CreatCheckinContext);

  const handleChange = (event) => {
    const count = event.target.value;
    setValue(count);
    const newAchievementCounts = new Map(achievementCounts);
    newAchievementCounts.set(id, count);
    setAchievementCounts(newAchievementCounts);
    setSelectedAchievementCountById(id, count);
  };

  return (
    <Select style={{ flex: 1 }} value={v} onChange={handleChange}>
      {Array.from(Array(10).keys()).map((_, i) => (
        <MenuItem key={i + 1} value={i + 1}>
          {i + 1}
        </MenuItem>
      ))}
    </Select>
  );
};

const HeaderWithTags = ({
  title,
  selected,
  setSelected,
  showCount = false
}) => {
  return (
    <div
      style={{
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 10
      }}
    >
      <h2 style={{ paddingRight: 10 }}>{title}</h2>
      <div style={{ flex: 1 }}>
        {Array.from(selected).map(([id, sa]) => (
          <Chip
            avatar={<Avatar>{showCount ? sa.count : null}</Avatar>}
            key={id}
            label={sa.name}
            style={{ marginRight: 10 }}
            onDelete={() => {
              const newSelected = new Map(selected);
              newSelected.delete(id);
              setSelected(newSelected);
            }}
          />
        ))}
      </div>
      {showCount && (
        <Chip
          color="primary"
          icon={<PlusIcon />}
          label={Array.from(selected).reduce(
            (acc: number, sa) => (acc += sa[1].count * sa[1].points),
            0
          )}
        />
      )}
    </div>
  );
};

const CreatCheckinContext = createContext<
  [
    Map<string, number>,
    React.Dispatch<React.SetStateAction<Map<string, number>>>,
    (id: string, count: number) => void
  ]
>([new Map<string, number>(), () => {}, (id, count) => {}]);

const categoryOperators = [
  {
    label: 'Is',
    value: 'is',
    getApplyFilterFn: (filterItem) => {
      if (
        !filterItem.columnField ||
        !filterItem.value ||
        !filterItem.operatorValue
      ) {
        return null;
      }

      return (params) => {
        switch (filterItem.value as CategoryFilterSelection) {
          case 'ALL_CATEGORIES':
            return true;
          case 'NO_CATEGORY':
            return !params.row.category_id;
          default:
            return params.row.category_id === filterItem.value;
        }
      };
    },
    InputComponent: CategoryFilter,
    InputComponentProps: { type: 'string' }
  }
];

export const CreateCheckin: FC<CreateCheckinProps> = ({
  onDismiss
}) => {
  const classes = useStyles();
  let achievements: Achievement[] = db.useCollection('achievements', [
    'name'
  ]);
  let users: User[] = db.useCollection('users', ['name']);
  const [selectedAchievements, setSelectedAchievements] = useState(
    new Map<string, SelectedItem>()
  );
  const [achievementCounts, setAchievementCounts] = useState(
    new Map<string, number>()
  );
  const setSelectedAchievementCountById = (
    id: string,
    count: number
  ) => {
    const newSelectedAchievements = new Map(selectedAchievements);
    const a = newSelectedAchievements.get(id);
    if (a) {
      newSelectedAchievements.set(id, { ...a, count });
      setSelectedAchievements(newSelectedAchievements);
    }
  };

  const [selectedUsers, setSelectedUsers] = useState(
    new Map<string, SelectedItem>()
  );

  const handleEditCellChangeCommitted = React.useCallback(
    async ({ id, field, props }) =>
      db.models.checkins.update(id, props.value),
    [achievements]
  );

  useEffect(() => {}, [achievementCounts]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  if (!open) {
    return null;
  }

  return (
    <Paper
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      elevation={3}
    >
      <CreatCheckinContext.Provider
        value={[
          achievementCounts,
          setAchievementCounts,
          setSelectedAchievementCountById
        ]}
      >
        <h2 className={classes.addCheckinHeader}>Add Checkin</h2>
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
        <Paper style={{ margin: 20, flex: 1 }} variant="outlined">
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab
                label={`Achievements${
                  selectedAchievements.size > 0
                    ? ` (${selectedAchievements.size})`
                    : ''
                }`}
              />
              <Tab
                label={`Users${
                  selectedUsers.size > 0
                    ? ` (${selectedUsers.size})`
                    : ''
                }`}
              />
            </Tabs>
          </AppBar>
          <TabPanel
            value={value}
            style={{ height: '100%' }}
            index={0}
          >
            <>
              <HeaderWithTags
                title="Achievements"
                selected={selectedAchievements}
                setSelected={setSelectedAchievements}
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
                    selectedAchievements.keys()
                  )}
                  onSelectionModelChange={({ selectionModel }) => {
                    setSelectedAchievements(
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
                              count: achievementCounts.get(a.id) ?? 1
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
            value={value}
            style={{ height: '100%' }}
            index={1}
          >
            <HeaderWithTags
              title="Users"
              selected={selectedUsers}
              setSelected={setSelectedUsers}
            />
            <div style={{ height: 'calc(100% - 75px)' }}>
              <DataGrid
                editMode="client"
                rows={users}
                columns={usersColumns}
                selectionModel={Array.from(selectedUsers.keys())}
                onSelectionModelChange={({ selectionModel }) => {
                  setSelectedUsers(
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
        </Paper>
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
      </CreatCheckinContext.Provider>
    </Paper>
  );
};

type CategoryFilterSelection =
  | 'ALL_CATEGORIES'
  | 'NO_CATEGORY'
  | number;

function CategoryFilter(props) {
  const { item, applyValue } = props;
  const [v, setValue] = useState<CategoryFilterSelection>(
    item.value ?? 'ALL_CATEGORIES'
  );

  const handleFilterChange = (event) => {
    const cat = event.target.value;
    setValue(cat);
    applyValue({ ...item, value: cat });
  };

  const achievementCategories = db.useCollection<AchievementCategory>(
    'achievement_categories',
    ['name']
  );

  return (
    <FormControl>
      <InputLabel id="demo-simple-select-label">Category</InputLabel>
      <NativeSelect value={v} onChange={handleFilterChange}>
        <option key={'ALL_CATEGORIES'} value={'ALL_CATEGORIES'}>
          All Categories
        </option>
        <option key={'NO_CATEGORY'} value={'NO_CATEGORY'}>
          No Category
        </option>
        {achievementCategories.map((ac, i) => (
          <option key={i + 1} value={ac.id}>
            {ac.name}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
