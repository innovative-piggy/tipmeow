import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import DashboardIcon from "@material-ui/icons/Dashboard";
import GettingStartedIcon from "@material-ui/icons/Cake";
import LogOutIcon from "@material-ui/icons/ExitToApp";
import PortalIcon from "@material-ui/icons/SettingsBrightness";
import {
  Email,
  Folder,
  Drafts,
  ExpandMore,
  ExpandLess,
  Send,
  Inbox,
  Settings,
  AttachMoney,
  EmojiPeople,
  Loyalty,
  InsertDriveFile,
  MailOutline,
} from "@material-ui/icons";

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 5
  },
  active: {
    backgroundColor: "#B0BEC5"
  }
});

class NavList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openLinks: false,
      active: ""
    };
  }

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("timestamp");
      this.props.history.push("/login");
  };

  handleLinkClick = () => {
    this.setState(state => ({ openLink: !state.openLink }));
  };

  handleFormsLinkClick = () => {
    this.setState(state => ({ openFormsLink: !state.openFormsLink }));
  };

  handleNotificationsLinkClick = () => {
    this.setState(state => ({
      openNotificationsLink: !state.openNotificationsLink
    }));
  };

  changeNav = name => event => {
    let path = `/${name}`;
    this.props.history.push(path);
  };

  render() {
    const currentPath = this.props.location.pathname.split("/")[1];
    console.log(currentPath);
    const { classes } = this.props;
    return (
      <div>
        <List component="nav">
          <ListItem
            button
            className={
              currentPath === "dashboard" ? classes.active : classes.normal
            }
            onClick={this.changeNav("dashboard")}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="The Money Flow" />
          </ListItem>
          <ListItem
            button
            className={currentPath === "tips" ? classes.active : classes.normal}
            onClick={this.changeNav("tips")}
          >
            <ListItemIcon>
              <AttachMoney />
            </ListItemIcon>
            <ListItemText primary="Your Tips" />
          </ListItem>
          <ListItem
            button
            className={currentPath === "page" ? classes.active : classes.normal}
            onClick={this.changeNav("page")}
          >
            <ListItemIcon>
              <InsertDriveFile />
            </ListItemIcon>
            <ListItemText primary="Tip Pathways" />
          </ListItem>
       
          {/* 
          <ListItem
            button
            className={
              currentPath === "referrals" ? classes.active : classes.normal
            }
            onClick={this.changeNav("referrals")}
          >
            <ListItemIcon>
              <Loyalty />
            </ListItemIcon>
            <ListItemText primary="Rewards" />
          </ListItem> */}

          <ListItem
            button
            className={
              currentPath === "settings" ? classes.active : classes.normal
            }
            onClick={this.changeNav("settings")}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Bank Setup" />
          </ListItem>

          <Divider />

          <ListItem button onClick={this.handleLogout}>
            <ListItemIcon>
              <LogOutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </div>
    );
  }
}

NavList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavList);
