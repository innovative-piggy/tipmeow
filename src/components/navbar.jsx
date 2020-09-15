import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import MoreIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import NavList from './navlist';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'white',
    minHeight:80,
    boxShadow: '0px 0px 10px #00000029',
  },
  toolBar: {
    minHeight:80,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('lg')]: {
      display: 'flex',
      },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  logoImage: {
    // display: 'none',
    // [theme.breakpoints.up('sm')]: {
    //   display: 'block',
    // },
    paddingTop: 16,
    paddingBottom: 16,
  },
  badge: {
      top: 6,
      right: 5,
      minWidth: 15,
      height: 15,
  },  
  largeAvatar: {
      width: theme.spacing(6),
      height: theme.spacing(6),
  },
  meowButton: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
    display: 'flex',
    },
    backgroundColor: 'grey',
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 28,
    paddingLeft: 28,
    borderRadius: 8,
    marginRight: 60,
    '&:hover': {
      backgroundColor: 'grey',
    }
  },
  toolbar: {
      minHeight: 80,
  },
  noHoverButton: {
    '&:hover': {
      backgroundColor: 'white'
    }
  }
}));

export default function NavBar(props) {
    const classes = useStyles();
// App Bar
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isMenuOpen = Boolean(anchorEl);

    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';
    
    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    }; 
    const handleMenuClose = () => {
      setAnchorEl(null);
      handleMobileMenuClose();
    };    
    const handleProfileMenuOpen = event => {
      setAnchorEl(event.currentTarget);
    };
    // const renderMenu = (
    //   <Menu
    //     anchorEl={anchorEl}
    //     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    //     id={menuId}
    //     keepMounted
    //     transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    //     open={isMenuOpen}
    //     onClose={handleMenuClose}
    //   >
    //     <Link to={'/editUser'}><MenuItem onClick={handleMenuClose}>Edit User</MenuItem></Link>
    //     <MenuItem onClick={handleMenuClose}>Log Out</MenuItem>
    //   </Menu>
    // );
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton aria-label="notifications" color="inherit">
            <Badge badgeContent={1} color="primary" classes={{ badge: classes.badge }}>
              <NotificationsNoneIcon style={{fontSize: '30px', color: 'black'}}/>
            </Badge>
          </IconButton>
        </MenuItem>
        <MenuItem>
          <IconButton
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
              onClick={handleProfileMenuOpen}
          >
            <Avatar alt="Tem" src={require("../asset/images/tem-pic.png")}/>
          </IconButton>
        </MenuItem>
      </Menu>
    );
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolBar} >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon color="primary"/>
          </IconButton>       
          <img className={classes.logoImage} alt="complex" src={require("../asset/images/logo.svg")}/>
          <div className={classes.grow} />
          <Button className={classes.meowButton}>Meow</Button>
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="notifications" className={classes.noHoverButton}>
              <Badge badgeContent={1} color="primary" classes={{ badge: classes.badge }}>
                <NotificationsNoneIcon style={{fontSize: '30px', color: 'black'}}/>
              </Badge>
            </IconButton>
            <IconButton
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                className={classes.noHoverButton}
            >
                <Typography style={{paddingRight:'10px', color: 'grey'}}>Tem Balanco</Typography>
                <Avatar alt="Tem" src={require("../asset/images/tem-pic.png")} className={classes.largeAvatar}/>
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon color="primary"/>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {/* {renderMenu} */}
      <NavList mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}/>
    </div>
  );
}