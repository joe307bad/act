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
import EventIcon from '@material-ui/icons/Event';
import AddIcon from '@material-ui/icons/Add';
import Category from '@material-ui/icons/Category';
import Button from '@material-ui/core/Button';
import db from '@act/data/web';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useLocation
} from 'react-router-dom';
import Communities from './communities';
import Events from './events';
import AchievementCategories from './achievement-categories';

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
    toolbar: theme.mixins.toolbar
  })
);

const ToolBar = () => {
  const classes = useStyles();
  const { pathname } = useLocation();

  const [title, insertText, insertFn] = ((): [
    string?,
    string?,
    (() => void)?
  ] => {
    switch (pathname) {
      case '/achievement-categories':
        return [
          'Achievement Categories',
          'Add Category',
          db.models.achievementCategories.insert
        ];
      case '/communities':
        return [
          'Communities',
          'Add Community',
          db.models.communities.insert
        ];
      default:
        return [undefined, undefined, undefined];
    }
  })();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography style={{ flex: 1 }} variant="h6" noWrap>
          {title}
        </Typography>
        {insertFn && (
          <Button
            variant="contained"
            color="default"
            startIcon={<AddIcon />}
            onClick={insertFn}
          >
            {insertText}
          </Button>
        )}
        <Button
          style={{ marginLeft: 10 }}
          variant="contained"
          color="default"
          onClick={db.sync}
        >
          Sync
        </Button>
      </Toolbar>
    </AppBar>
  );
};

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        <ToolBar />
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
            <ListItem component={Link} to="/communities" button>
              <ListItemIcon>
                <LocationCity />
              </ListItemIcon>
              <ListItemText primary={'Communities'} />
            </ListItem>
            <ListItem component={Link} to="/events" button>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary={'Events'} />
            </ListItem>
            <ListItem
              component={Link}
              to="/achievement-categories"
              button
            >
              <ListItemIcon>
                <Category />
              </ListItemIcon>
              <ListItemText primary={'Achievement Categories'} />
            </ListItem>
          </List>
          <Divider />
        </Drawer>
        <Switch>
          <Route exact path="/">
            <Redirect to="/communities" />
          </Route>
          <Route path="/communities">
            <Communities />
          </Route>
          <Route path="/events">
            <Events />
          </Route>
          <Route path="/achievement-categories">
            <AchievementCategories />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
