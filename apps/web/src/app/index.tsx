import React, { useState } from 'react';
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
import { Stars } from '@material-ui/icons';
import EventIcon from '@material-ui/icons/Event';
import AddIcon from '@material-ui/icons/Add';
import Category from '@material-ui/icons/Category';
import People from '@material-ui/icons/People';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Camera from '@material-ui/icons/Camera';
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
import Communities from './pages/communities';
import Events from './pages/events';
import AchievementCategories from './pages/achievement-categories';
import Achievements from './pages/achievement';
import Users from './pages/users';
import Checkins from './pages/checkins';
import Uploads from './pages/uploads';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%'
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
    toolbar: theme.mixins.toolbar,
    active: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      pointerEvents: 'none'
    }
  })
);

type CurrentPage = {
  title: string;
  insertText?: string;
  insertFn?: (...args: any) => void;
};

enum PAGE {
  ACHIEVEMENT_CATEGORIES = '/achievement-categories',
  COMMUNITIES = '/communities',
  EVENTS = '/events',
  ACHIEVEMENT = '/achievements',
  USERS = '/users',
  CHECKINS = '/checkins',
  UPLOADS = '/uploads'
}

const ToolBarAndSideBar = ({ onClick }) => {
  const classes = useStyles();
  const { pathname } = useLocation();

  const { title, insertText, insertFn } = ((): CurrentPage => {
    switch (pathname) {
      case PAGE.ACHIEVEMENT_CATEGORIES:
        return {
          title: 'Achievement Categories',
          insertText: 'Add Category',
          insertFn: db.models.achievementCategories.insert
        };
      case PAGE.COMMUNITIES:
        return {
          title: 'Communities',
          insertText: 'Add Community',
          insertFn: db.models.communities.insert
        };
      case PAGE.EVENTS:
        return {
          title: 'Events',
          insertText: 'Add Event'
        };
      case PAGE.ACHIEVEMENT:
        return {
          title: 'Achievements',
          insertText: 'Add Achievement',
          insertFn: () =>
            db.models.achievements.insert('New Achievement')
        };
      case PAGE.USERS:
        return {
          title: 'Users',
          insertText: 'Add User',
          insertFn: () => db.models.users.insert('New User')
        };
      case PAGE.CHECKINS:
        return {
          title: 'Checkins',
          insertText: 'Add Checkin',
          insertFn: onClick
        };
      case PAGE.UPLOADS:
        return {
          title: 'Uploads'
        };
      default:
        return {} as CurrentPage;
    }
  })();

  const isActive = (route) =>
    pathname === route ? classes.active : undefined;

  return (
    <>
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
            onClick={() => db.sync()}
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
          <ListItem
            component={Link}
            to={PAGE.COMMUNITIES}
            button
            className={isActive(PAGE.COMMUNITIES)}
          >
            <ListItemIcon>
              <LocationCity className={isActive(PAGE.COMMUNITIES)} />
            </ListItemIcon>
            <ListItemText primary={'Communities'} />
          </ListItem>
          <ListItem
            component={Link}
            to={PAGE.EVENTS}
            button
            className={isActive(PAGE.EVENTS)}
          >
            <ListItemIcon>
              <EventIcon className={isActive(PAGE.EVENTS)} />
            </ListItemIcon>
            <ListItemText primary={'Events'} />
          </ListItem>
          <ListItem
            component={Link}
            to={PAGE.ACHIEVEMENT}
            button
            className={isActive(PAGE.ACHIEVEMENT)}
          >
            <ListItemIcon>
              <Stars className={isActive(PAGE.ACHIEVEMENT)} />
            </ListItemIcon>
            <ListItemText primary={'Achievements'} />
          </ListItem>
          <ListItem
            component={Link}
            to={PAGE.ACHIEVEMENT_CATEGORIES}
            button
            className={isActive(PAGE.ACHIEVEMENT_CATEGORIES)}
          >
            <ListItemIcon>
              <Category
                className={isActive(PAGE.ACHIEVEMENT_CATEGORIES)}
              />
            </ListItemIcon>
            <ListItemText primary={'Achievement Categories'} />
          </ListItem>
          <ListItem
            component={Link}
            to={PAGE.USERS}
            button
            className={isActive(PAGE.USERS)}
          >
            <ListItemIcon>
              <People className={isActive(PAGE.USERS)} />
            </ListItemIcon>
            <ListItemText primary={'Users'} />
          </ListItem>
          <ListItem
            component={Link}
            to={PAGE.CHECKINS}
            button
            className={isActive(PAGE.CHECKINS)}
          >
            <ListItemIcon>
              <CheckCircle className={isActive(PAGE.CHECKINS)} />
            </ListItemIcon>
            <ListItemText primary={'Checkins'} />
          </ListItem>
          <ListItem
            component={Link}
            to={PAGE.UPLOADS}
            button
            className={isActive(PAGE.UPLOADS)}
          >
            <ListItemIcon>
              <Camera className={isActive(PAGE.UPLOADS)} />
            </ListItemIcon>
            <ListItemText primary={'Uploads'} />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
    </>
  );
};

const App = () => {
  const classes = useStyles();
  const [showCheckinDetails, setShowCheckinDetails] = useState(false);

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        <ToolBarAndSideBar
          onClick={() => setShowCheckinDetails(true)}
        />
        <Switch>
          <Route exact path="/">
            <Redirect to={PAGE.COMMUNITIES} />
          </Route>
          <Route path={PAGE.COMMUNITIES}>
            <Communities />
          </Route>
          <Route path={PAGE.EVENTS}>
            <Events />
          </Route>
          <Route path={PAGE.ACHIEVEMENT_CATEGORIES}>
            <AchievementCategories />
          </Route>
          <Route path={PAGE.ACHIEVEMENT}>
            <Achievements />
          </Route>
          <Route path={PAGE.USERS}>
            <Users />
          </Route>
          <Route path={PAGE.UPLOADS}>
            <Uploads />
          </Route>
          <Route path={PAGE.CHECKINS}>
            <Checkins
              open={showCheckinDetails}
              openCheckin={() => setShowCheckinDetails(true)}
              onDismiss={() => setShowCheckinDetails(false)}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
