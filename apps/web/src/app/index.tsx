import React from 'react';
import {
  createStyles,
  Theme,
  makeStyles
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocationCity from '@material-ui/icons/LocationCity';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { useCollection, getDatabase, sync } from './database';
import { IconButton } from '@material-ui/core';

const columns = (deleteCommunity): GridColDef[] => {
  return [
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
      field: '',
      filterable: false,
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: ({ id }) => {
        return (
          <IconButton
            onClick={() => deleteCommunity(id)}
            aria-label="delete"
            color="secondary"
          >
            <DeleteIcon />
          </IconButton>
        );
      }
    }
  ];
};

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3)
    }
  })
);

const useCommunities = (database) => {
  const c = database.collections.get('communities');
  const d = database.collections.get('deleted');
  return {
    observe: () => c.query().observeWithColumns(['name']),
    insert: async () => {
      await database.action(() =>
        c.create((community) => {
          community.name = 'New community';
        })
      );
    },
    update: async (id, name) => {
      await database.action(async () => {
        const communityToEdit = await c.find(id);
        await communityToEdit.update((community) => {
          community.name = name;
        });
      });
    },
    delete: async (id) => {
      await database.action(async () => {
        const communityToDelete = await c.find(id);
        await d.create((deletedUnit) => {
          deletedUnit.deletedId = id;
        });
        await communityToDelete.markAsDeleted();
      });
    }
  };
};

const App = () => {
  const classes = useStyles();
  const {
    observe,
    insert,
    update,
    delete: d
  } = useCommunities(getDatabase());

  let communities: any[] = useCollection('communities');

  const handleEditCellChangeCommitted = React.useCallback(
    async ({ id, field, props }) => update(id, props.value),
    [communities]
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography style={{ flex: 1 }} variant="h6" noWrap>
            Communities
          </Typography>
          <Button
            variant="contained"
            color="default"
            startIcon={<AddIcon />}
            onClick={insert}
          >
            Add Commmunity
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            variant="contained"
            color="default"
            onClick={() => sync()}
          >
            Sync
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <LocationCity />
            </ListItemIcon>
            <ListItemText primary={'Communities'} />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            editMode="client"
            rows={communities}
            columns={columns(d)}
            onEditCellChangeCommitted={handleEditCellChangeCommitted}
            pageSize={5}
            checkboxSelection
          />
        </div>
      </main>
    </div>
  );
};

export default App;
