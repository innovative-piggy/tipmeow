import React, {useState,useEffect}  from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {Button} from '@material-ui/core';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import PowerSettingsNewOutlinedIcon from '@material-ui/icons/PowerSettingsNewOutlined';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import history from '../asset/common/history';
import clsx from 'clsx';
import axios from "axios";
import qs from "query-string";
import {useDispatch} from 'react-redux';
import allActions from '../asset/actions';
const apiBaseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
    drawer: {  
    display: 'none',
    [theme.breakpoints.up('md')]: {
        display: 'block',        
        width: drawerWidth,
        flexShrink: 0,
    },
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },  
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: {
        height: 64,
    },
    connectYour: {
        color: '#577BF9',
        paddingTop: 16,
        fontSize: 16,
    },
    stripeButton: {
        backgroundColor: '#577BF9',
        padding: '10px 46px',
        borderRadius: 10,
        marginLeft: 30,
        marginBottom: 14,
        boxShadow: '2px 5px 5px #DFDFDF',
        '&:hover': {
            backgroundColor: '#577BF9',
        }
    },
    meanLink: {
        color: '#8B8B8B',
        fontSize: 14,
    },
    verticalLine: {
        borderLeft: '3px solid #ffffff',
        height: 56,
        paddingRight: 39,
    },
    activeVerticalLine: {
        borderLeft: '3px solid #577BF9',
    },
    menuText: {
        fontSize: 20,
        color: '#8C8C8D',
    },
    activeMenuText: {
        color: '#000000'
    },
    menuListIcon: {
        fontSize: 33,
        color: '#8C8C8D',
    },
    ActiveMenuListIcon: {
        color: '#577BF9',
    },
    howWork: {
        color: '#577BF9',
        padding: '30px 63px',
        fontSize: 16,
    },
    logoImage: {
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 40,
    },
    logoutButton: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ffffff',
        padding: 0,
    },
    listItem: {
        padding: 0,
    },
    activeListItem: {
        backgroundColor: '#F3F3F3',
    },
    connectStripeButton: {
        padding: '32px 67px 0'
    },
}));

export default function SideBar(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const [stripeConnected, setStripConnected] = useState(false);
    useEffect(() => { 
        axios({
            method: "get",
            url: `${apiBaseUrl}/v1/org/me`,
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        }).then(function(response) {
            if (response.data.stripe_credentials) {
                setStripConnected(true)
            };
        }).catch(function(error) {
            showNotification("Error connecting to Stripe");
        });

    },[]);
    const showNotification = (
        message = "no message recieved in notification function",
        type = "error"
    ) => {
        // this.setState({
        //     snackOpen: true, 
        //     snackVariant: type,
        //     snackMessage: message
        // });
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("timestamp");
        history.push("/login");
    };
    const {mobileOpen,handleDrawerToggle} = props;
    const [clickedItem, setClickedItem] = useState(0);
    const onClickMethod = (index,path) => {
        setClickedItem(index);
        history.push(path);
     };
     const listItem = [
         {icon: <DashboardOutlinedIcon  className={clsx({[classes.menuListIcon]:true},{[classes.ActiveMenuListIcon]: clickedItem === 0 })}/>, text: "Dashboard", path: "/dashboard"},
         {icon: <MonetizationOnOutlinedIcon className={clsx({[classes.menuListIcon]:true},{[classes.ActiveMenuListIcon]: clickedItem === 1 })}/>, text: "Tips", path: "/tips"},
         {icon: <img alt="complex" src={clickedItem === 2 ? require("../asset/images/tipPageIconBlue.svg") : require("../asset/images/tipPageIcon.svg")}/>, text: "Tip Pages", path: "/page"},
         {icon: <TimelineOutlinedIcon className={clsx({[classes.menuListIcon]:true},{[classes.ActiveMenuListIcon]: clickedItem === 3 })}/>, text: "My Stats", path: "/myStats"},
         {icon: <SettingsIcon className={clsx({[classes.menuListIcon]:true},{[classes.ActiveMenuListIcon]: clickedItem === 4 })}/>, text: "Settings", path: "/setting"},
     ];
     const hanldConnect = () => {
        setStripConnected(!stripeConnected);
        dispatch(allActions.stripeAction.stripeConnection(!stripeConnected));
     }
    const drawer = (
        <div>
            <img className={classes.logoImage} alt="complex" src={require("../asset/images/logo.svg")}/>
            <Divider style={{marginBottom: '16px'}}/>
            {stripeConnected
                ?   <Box>
                        <img onClick={hanldConnect} className={classes.connectStripeButton} alt="complex" src={require("../asset/images/blackStripe.svg")}/>
                        <Box display="flex" textAlign="center">
                            <CheckCircleIcon style={{color: '#57B405', marginLeft: 60, marginRight: 5}} />
                            <Typography style={{color: '#57B405'}}><b>Connected</b></Typography>
                        </Box>
                        <Typography align='center' style={{paddingTop: 12}} >
                            <Link to="#"  className={classes.meanLink}>
                                Manage settings.
                            </Link>
                        </Typography>
                    </Box>
                :   <Box>
                        <Typography align='center' className={classes.connectYour}><b>Connect Your</b></Typography>
                        <Button 
                            className={classes.stripeButton}
                            // href={
                            //     "https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_GNqLEw8624zbLSJ2ecOaMXNtinF8ESCt&scope=read_write&redirect_uri=" +
                            //     "https://app.tipmeow.com/settings"
                            // }
                            onClick={hanldConnect}
                        >
                            <img alt="complex" src={require("../asset/images/stripe.svg")}/>
                        </Button>
                        <Typography align='center' style={{paddingBottom: 20}}>
                            <Link to="#"  className={classes.meanLink}>
                                What does it mean?
                            </Link>
                        </Typography>
                    </Box>}
            <List>
                {listItem.map((item,index) => {
                    return (
                        <ListItem button key={index} className={clsx({[classes.listItem]:true},{[classes.activeListItem]: clickedItem === index })} onClick={() => onClickMethod(index,item.path)}>
                            <div className={clsx({[classes.verticalLine]:true},{[classes.activeVerticalLine]: clickedItem === index })} />
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} className={clsx({[classes.menuText]:true},{[classes.activeMenuText]: clickedItem === index })} />
                        </ListItem>
                    )
                })}
            </List>
            <Typography align='center' className={classes.howWork}>See How TipMeow Works</Typography>
            {stripeConnected ?  <img  alt="complex" src={require("../asset/images/howWorkConnected.svg")}/>
                : <img  alt="complex" src={require("../asset/images/howWork.svg")}/>}
            <ListItem style={{ backgroundColor: 'white' }} button key='logout' className={classes.logoutButton} onClick={handleLogout}>
                <div className={classes.verticalLine}></div>
                <ListItemIcon>
                    <PowerSettingsNewOutlinedIcon className={classes.menuListIcon}/>
                </ListItemIcon>
                <ListItemText primary="Logout" className={classes.menuText} />
            </ListItem>
        </div>
    );
    
    return (
        <nav className={classes.drawer} aria-label="mailbox folders">
            <Hidden smUp implementation="css">
                <Drawer
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                    paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                    paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                >
                    {drawer}
                </Drawer>
            </Hidden>
        </nav>
    )
}