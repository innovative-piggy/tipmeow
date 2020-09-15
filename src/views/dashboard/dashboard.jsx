import React,{useState} from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {Card, CardContent, Box, FormControl, Select, MenuItem, ListItemText, TableBody, Table, TableHead, TableRow, TableCell} from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Line,Bar} from 'react-chartjs-2';
import clsx from 'clsx';
import useStyles from './dashboard.style';
import Moment from 'moment';
import { useSelector } from 'react-redux'
import useMediaQuery from '@material-ui/core/useMediaQuery';
const apiBaseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

export default function Dashboard (props) {
  const width400 = useMediaQuery('(max-width:480px)');
  const containerStyles = {};
  
  if(width400) {
    containerStyles.padding = '0px'
  }
// Dummy Chart Data
  const lineChartState = (canvas) => {
    const ctx = canvas.getContext("2d")
    const gradient = ctx.createLinearGradient(0,0,0,300);
    gradient.addColorStop(0, '#C0C5FA');
    gradient.addColorStop(0.5, "#ffffff");
    return {
      labels: ['','Jan', 'Feb', 'Mar','Apr', 'May','Jun','Jul',''],
      datasets: [
        {
          label: 'Tip',
          fill: true,
          backgroundColor: gradient,
          borderColor: '#4044FC',
          data: [65, 59, 80, 81, 56,77,20,35,80]
        }
      ],
    }
  };
  const barChartData = {
    labels: [1,2,3,4,5,6,7,8,9,10],
    datasets: [
      {
        backgroundColor: '#AEAEAF',
        data: [65, 59, 80, 81, 56,10,15,70,43,65]
      }
    ]
  };
  const barChartMapData = [
    {id: 0, name: "Visitors", data: barChartData, amount: 56},
    {id: 1, name: "Tip Conversions", data: barChartData, amount: 25},
    {id: 2, name: "Tip Conversion Rate", data: barChartData, amount: "25%"}
  ];
  const tableData = [
    {amount: 5, status: 'Processed', date: new Date(), tipPage: 'tembalanco'},
    {amount: 3, status: 'Processed', date: new Date(), tipPage: 'tembalanco'},
    {amount: 14, status: 'Processed', date: new Date(), tipPage: 'runawayband'},
    {amount: 2, status: 'Processed', date: new Date(), tipPage: 'runawayband'},
  ]
/////////////////////////////////////////////////////////////////////////////////
  const stripeConnected = useSelector(state => state.stripeConnection.stripeConnection);
  const classes = useStyles();
  const step = ["Yearly","Monthly","Daily"];
  const noConnect = (
    <Box 
      display="flex" 
      height={235}
      alignItems="center"
      justifyContent="center"
    >
      <CardContent style={{textAlign: 'center'}}>  
        <img alt="complex" src={require("../../asset/images/greyLogo.svg")}/>
        <Typography className={classes.noYet}>No tips yet!</Typography>
      </CardContent>
    </Box>
  );
  return (
      <Grid container spacing={5} className={classes.root} style={containerStyles}>
        {/* Dashboard Title */}
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.title}>TipMeow Dashboard</Typography>
        </Grid>
        {/* My Tips Widget */}
        <Grid item xs={12} sm={12} md={12} lg={4} >
          <Card className={classes.card}>
            <Box display="flex">
              <Typography className={classes.cardHeader}>My Tips</Typography>
              <Box style={{flexGrow: 1}} />
              {stripeConnected ? 
              <Typography>
                  <Link to="#"  className={classes.viewFullState}>
                      View Full Status
                  </Link>
              </Typography> : ''}
            </Box>
            {stripeConnected ?
            <CardContent style={{padding: 0}}>
            <Typography className={classes.totalAmount}>$221.42</Typography>
            <FormControl classes={{root: classes.formControlRoot}} style={{paddingBottom: 15}}>
              <Select
                id="step"
                name="step"
                value="Monthly"
                // onChange={handleChangeFilterOption}
                renderValue={(selected) => (
                <Typography>{selected}</Typography>
                )}
              >
                {step.map((step) => (
                  <MenuItem key={step} value={step}>
                    <ListItemText primary={step} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div style={{width: `calc(100% - 4px)`}}>
                <Line
                  height={116}
                  data={lineChartState}
                  options={{
                    responsive: true,
                    legend:{
                      display:false,
                    },
                    dot: false,
                    scales: {
                      xAxes: [{
                          gridLines: {
                              display:false
                          },
                          position: 'top',
                      }],
                      yAxes: [{
                          gridLines: {
                              display:false
                          },  
                          ticks: {
                              display: false,
                              beginAtZero: true
                          }
                      }]
                    }
                  }}
                />
            </div>
            </CardContent>
            : noConnect}
          </Card>
        </Grid>
        {/* Tip Page Statistics Widget */}
        <Grid item xs={12} sm={12} md={12} lg={8}>
          <Card className={classes.card}>
            <Box display='flex'>
              <Typography className={classes.cardHeader}>Tip Page Statistics</Typography>
              <Box style={{flexGrow: 1}} />
              <img className={clsx({[classes.createTipImg]: true},{[classes.connectedCreateTipImg]: stripeConnected})} alt="complex" src={require("../../asset/images/createTip.svg")}/>
              {stripeConnected ?
                <FormControl classes={{root: classes.formControlRootTipPage}}>
                  <Select
                    id="selectName"
                    name="selectName"
                    value="tembalanco"
                    // onChange={handleChangeFilterOption}
                    renderValue={(selected) => (
                    <Typography>{selected}</Typography>
                    )}
                  >
                    {step.map((step) => (
                      <MenuItem key={step} value={step}>
                        <ListItemText primary={step} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                : <Typography className={classes.createTipText} >Create your first tip page!</Typography>}
            </Box>
            {stripeConnected ?
            <Grid container className={classes.smallBarChartContainer} spacing={3}>
              {barChartMapData.map((data, index) => (
                <Grid key={index} item xs={12} md={4}>
                  <Paper elevation={5} className={classes.smallBarChart}>
                    <div>
                      <Typography className={clsx({[classes.barChartTitle]: true},{[classes.visitor]: index === 0},{[classes.tip]: index === 1},{[classes.rate]: index === 2},)}>{data.name}</Typography>
                      <Typography className={classes.viewFullState}>Last 10 days</Typography>                      
                    </div>
                    <Bar
                      className={classes.barChart}
                      height={80}
                      data={data.data}
                      options={{
                        responsive: true,
                        legend:{
                          display:false,
                        },
                        scales: {
                          xAxes: [{
                              gridLines: {
                                  display:false
                              },
                              ticks: {
                                  display: false,
                                  beginAtZero: true
                              },
                              barPercentage: 0.3
                          }],
                          yAxes: [{
                              gridLines: {
                                  display:false
                              },  
                              ticks: {
                                  display: false,
                                  beginAtZero: true
                              }
                          }]
                        }
                      }}
                    />
                    <Typography className={classes.barChartFooter}>{data.amount}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            :noConnect}
          </Card>
        </Grid>
        {/* Recent Tips Widget */}
        <Grid item xs={12} >
          <Card className={classes.card}>
            <Box display="flex">
              <Typography className={classes.cardHeader}>Recent Tips</Typography>
              <Box style={{flexGrow: 1}} />
              {stripeConnected ? 
              <Typography>
                  <Link to="#"  className={classes.viewFullState}>
                      View Full Status
                  </Link>
              </Typography> : ''}
            </Box>
            {stripeConnected ?
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeader}>Amount</TableCell>
                    <TableCell className={classes.tableHeader}>Status</TableCell>
                    <TableCell className={classes.tableHeader}>Date</TableCell>
                    <TableCell className={classes.tableHeader}>Tip Page</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row,index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.tableCell}>${row.amount.toFixed(2)}</TableCell>
                      <TableCell className={classes.tableCell}>{row.status}</TableCell>
                      <TableCell className={classes.tableCell}>{Moment(row.date).format('LL')}</TableCell>
                      <TableCell className={classes.tableCell}>
                        <Box display='flex'>
                          {row.tipPage}
                          <Box style={{flexGrow: 1}} />
                          <MoreVertIcon/>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              : noConnect}
          </Card>
        </Grid>
      </Grid>
  );
}