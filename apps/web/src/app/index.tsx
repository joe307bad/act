import React, { useState } from 'react';
import {
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocationCity from '@mui/icons-material/LocationCity';
import { Stars } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import Category from '@mui/icons-material/Category';
import People from '@mui/icons-material/People';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Camera from '@mui/icons-material/Camera';
import Button from '@mui/material/Button';
import db from '@act/data/web';
import {
  Link as RouterLink,
  Route,
  useLocation,
  Router,
  Routes,
  BrowserRouter
} from 'react-router-dom';
import Communities from './pages/communities';
import Events from './pages/events';
import AchievementCategories from './pages/achievement-categories';
import Achievements from './pages/achievement';
import Users from './pages/users';
import Checkins from './pages/checkins';
import Uploads from './pages/uploads';
import { StyledEngineProvider } from '@mui/material';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { red } from '@mui/material/colors';

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

  const Link = React.forwardRef(function Link(itemProps, ref) {
    // @ts-ignore
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
  });

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
              startIcon={<AddIcon />}
              onClick={insertFn}
            >
              {insertText}
            </Button>
          )}
          <Button
            style={{ marginLeft: 10 }}
            variant="contained"
            onClick={() => db.sync().catch(e => console.error(e))}
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
            // @ts-ignore
            component={Link}
            to={PAGE.COMMUNITIES}
            className={isActive(PAGE.COMMUNITIES)}
          >
            <ListItemIcon>
              <LocationCity className={isActive(PAGE.COMMUNITIES)} />
            </ListItemIcon>
            <ListItemText primary={'Communities'} />
          </ListItem>
          <ListItem
            // @ts-ignore
            component={Link}
            to={PAGE.EVENTS}
            className={isActive(PAGE.EVENTS)}
          >
            <ListItemIcon>
              <EventIcon className={isActive(PAGE.EVENTS)} />
            </ListItemIcon>
            <ListItemText primary={'Events'} />
          </ListItem>
          <ListItem
            // @ts-ignore
            component={Link}
            to={PAGE.ACHIEVEMENT}
            className={isActive(PAGE.ACHIEVEMENT)}
          >
            <ListItemIcon>
              <Stars className={isActive(PAGE.ACHIEVEMENT)} />
            </ListItemIcon>
            <ListItemText primary={'Achievements'} />
          </ListItem>
          <ListItem
            // @ts-ignore
            component={Link}
            to={PAGE.ACHIEVEMENT_CATEGORIES}
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
            // @ts-ignore
            component={Link}
            to={PAGE.USERS}
            className={isActive(PAGE.USERS)}
          >
            <ListItemIcon>
              <People className={isActive(PAGE.USERS)} />
            </ListItemIcon>
            <ListItemText primary={'Users'} />
          </ListItem>
          <ListItem
            // @ts-ignore
            component={Link}
            to={PAGE.CHECKINS}
            className={isActive(PAGE.CHECKINS)}
          >
            <ListItemIcon>
              <CheckCircle className={isActive(PAGE.CHECKINS)} />
            </ListItemIcon>
            <ListItemText primary={'Checkins'} />
          </ListItem>
          <ListItem
            // @ts-ignore
            component={Link}
            to={PAGE.UPLOADS}
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
const theme = createTheme({
  palette: {
    primary: {
      main: red[500]
    }
  }
});
const App = () => {
  const classes = useStyles();
  const [showCheckinDetails, setShowCheckinDetails] = useState(false);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <BrowserRouter>
            <CssBaseline />
            <ToolBarAndSideBar
              onClick={() => setShowCheckinDetails(true)}
            />
            <Routes>
              <Route path="/" element={<Communities />} />
              <Route
                path={PAGE.COMMUNITIES}
                element={<Communities />}
              />
              <Route
                path={PAGE.EVENTS}
                element={<Events />}
              />
              <Route
                path={PAGE.ACHIEVEMENT_CATEGORIES}
                element={<AchievementCategories />}
              />
              <Route
                path={PAGE.ACHIEVEMENT}
                element={<Achievements />}
              />
              <Route
                path={PAGE.USERS}
                element={<Users />}
              />
              <Route
                path={PAGE.UPLOADS}
                element={<Uploads />}
              />
              <Route
                path={PAGE.CHECKINS}
                element={<Checkins
                  open={showCheckinDetails}
                  openCheckin={() => setShowCheckinDetails(true)}
                  onDismiss={() => setShowCheckinDetails(false)}
                />}
              />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
