
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    formControlRoot: {
      '& >.MuiInput-underline:before': {
        display: 'none'
      },
      '& >.MuiInput-underline:after': {
        display: 'none'
      },
      '& >.MuiInputBase-root >.MuiInputBase-input' : {
        padding: '0 24px 0 0'
      },
      '& >.MuiInputBase-root >.MuiSelect-root >.MuiTypography-body1' : {
        fontSize: 13,
        color: '#8B8B8B',
      }
    },
    formControlRootTipPage: {
      paddingLeft: 5,
      backgroundColor: '#E5E5E8',
      borderRadius: '0 5px 5px 0',
      '& >.MuiInput-underline:before': {
        display: 'none'
      },
      '& >.MuiInput-underline:after': {
        display: 'none'
      },
      '& >.MuiInputBase-root >.MuiInputBase-input' : {
        padding: '5px 24px 0 0'
      },
      '& >.MuiInputBase-root >.MuiSelect-root >.MuiTypography-body1' : {
        fontSize: 16,
        color: '#8B8B8B',
      }
    },
    root: {
      flexGrow: 1,
      padding: 26,
      width: '100%',
      height: '100%',
      margin: 0,
      backgroundColor: '#E8EBF2'
    },
    title: {
      fontSize: 32,
      color: '#5F5D5D',
      marginLeft: 8,
    },
    card: {
      borderRadius: 12,
      padding: 20,
      boxShadow: '0px 0px 10px #00000029',
      height: '100%', 
    },
    cardHeader: {
      borderLeft: '5px solid #577BF9',
      fontSize: 19,
      color: '#5F5D5D',
      paddingLeft: 16,
      height: 35,
      alignItems: 'center',
      display: 'flex',
    },
    createTipImg: {
      backgroundColor: '#577BF9',
      borderRadius: 5,
      padding: 5
    },
    connectedCreateTipImg: {
      borderRadius: '5px 0 0 5px'
    },
    createTipText: {
      color: '#577BF9',
      fontSize: 18,
      marginLeft: 14,
      alignItems: 'center',
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
      [theme.breakpoints.down('md')]: {
        fontSize: 13,
      },
    },
    noYet: {
      color: '#B6B6BB',
      paddingTop: 20
    },
    viewFullState: {
      color: '#8B8B8B',
      fontSize: 12,
    },
    totalAmount: {
      fontSize: 30,
      paddingTop: 17,
      paddingBottom: 27
    },
    barChartTitle: {
      fontSize: 14,
      [theme.breakpoints.down('md')]: {
        fontSize: 14,
      },
      color: '#5F5D5D',
      paddingLeft: 10, marginBottom: 6
    },
    visitor: {
      borderLeft: '5px solid #577BF9', 
    },
    tip: {
      borderLeft: '5px solid #F1B018', 
    },
    rate: {
      borderLeft: '5px solid #57B405', 
    },
    smallBarChartContainer: {
        paddingTop: 70,
        paddingBottom: 35
    },
    smallBarChart: {
      [theme.breakpoints.down('sm')]: {
        width: 255,
      },
        margin: 'auto',
        borderRadius: 12,
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    barChartFooter: {
        color: '#5F5D5D',
        fontSize: 34
    },
    tableHeader: {
        fontSize: 18
    },
    tableCell: {
        fontSize: 15,
        color: '#8C8C8D',
        padding: '8px 16px',
        border: 'none'
    }
  }));

  export default useStyles;