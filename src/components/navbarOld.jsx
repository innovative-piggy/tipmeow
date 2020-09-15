import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import {
  ChevronRight,
  ChevronLeft,
  NotificationsIcon,
  Brightness7,
  Brightness4 //darkmode
} from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu"; //we cant use Menu becayse thats already used
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from "./messages/customSnack";
import NavList from "./navlist.jsx";

import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const isNotMobile = window.innerWidth > 600; //quick check to see the width of the screen

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    minHeight: "100vh",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex"
  },
  flex: {
    flex: 1
  },
  appFrame: {
    minHeight: "100vh",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "appBarShift-left": {
    marginLeft: drawerWidth
  },
  "appBarShift-right": {
    marginRight: drawerWidth
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: isNotMobile ? theme.spacing.unit * 3 : 0,
    paddingTop: isNotMobile ? theme.spacing.unit * 3 : theme.spacing.unit * 2,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  "content-left": {
    marginLeft: -drawerWidth
  },
  "content-right": {
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: 0
  },
  "contentShift-right": {
    marginRight: 0
  },
  avatar: {
    marginLeft: 0
  },
  logo: {
    maxWidth: "140px",
    maxHeight: "80px",
    zIndex: 10000
  }
});

class NavBar extends React.Component {
  state = {
    open: false,
    anchor: "left",
    anchorMenuEl: null,
    openDrawer: true,
    snackOpen: false
  };
  componentDidMount() {
    //this.showNotification("test", "error");
  }

  changeNav = name => event => {
    let path = `/${name}`;
    this.props.history.push(path);
  };

  handleMenu = event => {
    /*this.setState({
     anchorMenuEl: event.currentTarget,
     open: !this.state.open

   });*/
  };

  handleClose = () => {
    this.setState({ anchorMenuEl: null });
  };

  handleClose = () => {
    this.setState({ anchorMenuEl: null });
  };

  handleDrawerOpen = () => {
    this.setState({
      openDrawer: !this.state.openDrawer
    });
  };

  handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackOpen: false });
  };

  showNotification = (
    message = "no message recieved in notification function",
    type = "error"
  ) => {
    this.setState({
      snackOpen: true,
      snackType: type,
      snackMessage: message
    });
  };

  toggleColor = () => {
    const currentColor = localStorage.getItem("color_mode");
    const toggledColor = currentColor === "dark" ? "light" : "dark";
    localStorage.setItem(
      "color_mode",
      toggledColor
    );
    this.setState({
      colorMode: toggledColor
    });
    window.location.reload();
  };

  render() {
    const { classes, theme, children, ...other } = this.props;
    const { open, openDrawer, anchorMenuEl } = this.state;
    const anchor = "left";

    const drawer = (
      <Drawer
        variant="persistent"
        anchor={"left"}
        open={openDrawer}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerOpen}>
            {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>
        <Divider />
        <NavList {...other} />
      </Drawer>
    );

    let before = null;
    let after = null;

    if (anchor === "left") {
      before = drawer;
    } else {
      after = drawer;
    }

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
            position="fixed"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: openDrawer
            })}
          >
            <Toolbar>
              <IconButton
                onClick={this.handleDrawerOpen}
                color="inherit"
                aria-label="Open drawer"
                className={classNames(
                  classes.menuButton,
                  openDrawer && classes.hide
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography color="inherit" noWrap className={classes.flex}>
                {
                  <img
                    className={classes.logo}
                    src={process.env.REACT_APP_LOGO_URL_1}
                    alt="logo"
                  />
                }
              </Typography>
              <Typography color="inherit" noWrap className={classes.flex}>
                {this.props.header
                  ? this.props.header
                  : process.env.REACT_APP_BUSINESS_NAME}
              </Typography>
              {/* <IconButton
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
              <IconButton color="inherit" onClick={this.toggleColor}>
                <Badge color="secondary">
                  {this.state.colorMode === "light" ? <Brightness7 /> : <Brightness4 />}
                </Badge>
              </IconButton>
              {/* <IconButton
                aria-owns={open ? "menu-appbar" : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
                disabled
                className={classes.avatar}
              >
                <Typography style={{ color: "#fff", paddingRight: "8px" }}>
                  {`Hello ${localStorage.getItem("first_name")}!`}
                </Typography>
                <Avatar
                  aria-label="Avatar"
                  className={classes.avatar}
                  src={localStorage.getItem("gravatar")}
                />
              </IconButton> */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorMenuEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                open={open}
              >
                <MenuItem onClick={this.changeNav("settings/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={this.changeNav("logout")}>Logout</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          {before}
          <main
            className={classNames(
              classes.content,
              classes[`content-${anchor}`],
              {
                [classes.contentShift]: openDrawer,
                [classes[`contentShift-${anchor}`]]: openDrawer
              }
            )}
          >
            <div className={classes.drawerHeader} />
            {children}
          </main>
          {after}
        </div>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(NavBar);
