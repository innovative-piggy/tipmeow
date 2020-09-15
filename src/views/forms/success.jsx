import Paper from "@material-ui/core/Paper";
import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const apiBaseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 50,
    paddingBottom: 50,
    marginTop: theme.spacing.unit * 3
  })
});

class Success extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    console.log(this.props)
    return (
      <div style={{ backgroundColor: "#f1f1f1" }}>
        <Grid
          container
          alignContent="center"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item>
            <Paper className={classes.paper}>
              &#127881; {`Thank you for your support!`} &#127881;
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Success);
