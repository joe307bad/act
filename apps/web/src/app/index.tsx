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
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { compose, withHandlers } from 'recompose';
import withObservables from '@nozbe/with-observables';
import { sync, Community } from '@act/data';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';

let process = { env: {} };

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 100 },
  { field: 'created', headerName: 'Created', width: 130 }
];

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

const App = ({ allPosts, insertPost, sync }) => {
  const classes = useStyles();

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
            onClick={insertPost}
          >
            Add Commmunity
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            variant="contained"
            color="default"
            onClick={sync}
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
            rows={allPosts}
            columns={columns}
            pageSize={5}
            checkboxSelection
          />
        </div>
      </main>
    </div>
  );
};

const enhance = compose(
  withObservables(['community'], ({ database }) => {
    const communities =
      database.collections.get<Community>('communities');
    return {
      allPosts: communities.query()
    };
  }),
  withHandlers({
    insertPost:
      ({ database }) =>
      async () => {
        await database.action(() =>
          database.collections
            .get('communities')
            .create((community) => {
              community.title = 'New community';
              community.created = Date.now();
            })
        );
      },
    sync:
      ({ database }) =>
      () =>
        sync(database)
  })
);

export default withDatabase(enhance(App));
