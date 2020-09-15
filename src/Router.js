import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Router, Switch, Route } from 'react-router-dom';
import history from './asset/common/history';
import Dashboard from "./views/dashboard/dashboard.jsx";
import Tips from "./views/dashboard/tips.jsx";
import Page from "./views/page/page.jsx";
import ManagePage from "./views/page/managePage.jsx";
import Settings from "./views/settings/settings.jsx";
import Connections from "./views/payments/connections.jsx";
import NotFound from "./views/notfound.jsx";
import NavBar from "./components/navbar";
import { Box } from '@material-ui/core';

const PrivateLayout = () => (
    <Switch>
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/tips" exact component={Tips} />
        <Route path="/page" exact component={Page} />
        <Route path="/page/:id" exact component={ManagePage} />
        <Route path="/settings" exact component={Settings} />
        <Route path="/settings/connections" exact component={Connections} />
        <Route exact component={NotFound} />
    </Switch>
);
const useStyles = makeStyles((theme) => ({
    content: {
      flexGrow: 1,
      paddingTop: 80,
    },
    root: {
      display: 'flex',
    }
}));

export default function PrivateRoute(props) {
  const classes = useStyles();
  return (
    <Router history={history}>
        <Box className={classes.root}>
            <NavBar />
            <main className={classes.content}>
                <PrivateLayout />
            </main>
        </Box>
    </Router>
  );
}
