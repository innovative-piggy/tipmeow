import React from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import NavBar from "../../components/navbar";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from "../../components/messages/customSnack";
const apiBaseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

const styles = theme => ({
  logoImg: {
    height: "20%",
    width: "20%"
  },
  programListItem: {
    padding: theme.spacing(1, 1)
    //maxWidth: "700px",
    //width: "100%"
  }
});

class Connections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: []
    };
  }
  componentDidMount() {
    var self = this;

  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackOpen: false });
  };


  render() {
    console.log(this.state);
    const { classes, ...other } = this.props;

    return (
      <NavBar {...other}>
        <Grid container justify="center" spacing={1}>
          
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          open={this.state.snackOpen}
          autoHideDuration={3000}
          onClose={this.handleSnackClose}
        >
          <MySnackbarContentWrapper
            variant={this.state.snackVariant}
            message={this.state.snackMessage}
            onClose={this.handleSnackClose}
          />
        </Snackbar>
      </NavBar>
    );
  }
}

/*PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};*/

export default withStyles(styles)(Connections);
