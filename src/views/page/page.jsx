import React from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import NavBar from "../../components/navbar";
import Snackbar from "@material-ui/core/Snackbar";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MySnackbarContentWrapper from "../../components/messages/customSnack";
const apiBaseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

const styles = theme => ({
  logoImg: {
    height: "20%",
    width: "20%"
  },
  paper: theme.mixins.gutters({
    paddingTop: 50,
    paddingBottom: 50,
    marginTop: theme.spacing.unit * 3
  }),
  programListItem: {
    padding: theme.spacing(1, 1)
    //maxWidth: "700px",
    //width: "100%"
  }
});

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: "",
      forms: []
    };
  }
  componentDidMount() {
    var self = this;
    this.fetchForms();
  }

  fetchForms = () => {
    var self = this;
    axios({
      method: "get",
      url: `${apiBaseUrl}/v1/forms`,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(function(response) {
        console.log(response);
        if (response.status === 200) {
          self.setState({
            forms: response.data
          });
        }
      })
      .catch(function(error) {
        console.log(error);
        self.showNotification("Error fetching forms.");
      });
  };

  showNotification = (
    message = "no message recieved in notification function",
    type = "error"
  ) => {
    this.setState({
      snackOpen: true,
      snackVariant: type,
      snackMessage: message
    });
  };

  handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackOpen: false });
  };

  createForm = ev => {
    ev.preventDefault();
    const self = this;
    let payload = {
      nickname: this.state.nickname
    };
    axios({
      method: "post",
      url: `${apiBaseUrl}/v1/forms`,
      data: payload,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(function(response) {
        console.log(response);
        if (response.status === 200) {
          self.fetchForms();
        }
      })
      .catch(function(error) {
        console.log(error.response);
        self.showNotification(
          (error.response && error.response.data.message) ||
            "Error creating form."
        );
      });
  };

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
    const formRows = [];
    for (const form of this.state.forms) {
      formRows.push(
        <TableRow key={form._id}>
          {/* <TableCell><iframe src={`https://app.tipmeow.com/p/${form._id}`}></iframe></TableCell> */}
          <TableCell>
            <Typography variant="h6">{form.nickname}</Typography>
          </TableCell>
          <TableCell>
            <Button
              variant="contained"
              style={{
                margin: "4px"
              }}
              color="primary"
              href={`/page/${form._id}`}
            >
              Settings
            </Button>
            
            <Button
              variant="contained"
              style={{
                margin: "4px"
              }}
              color="primary"
              target="blank"
              href={`/p/${form._id}/qrcode`}
            >
              View Tip Sign
            </Button>
           
            <Button
              variant="contained"
              style={{
                margin: "4px"
              }}
              color="primary"
              target="_blank"
              href={`/p/${form.name}`}
            >
              View Payment Form
            </Button>
          </TableCell>
        </TableRow>
      );
    }

    return (
      // <NavBar
      //   snackMessage={this.state.snackMessage}
      //   snackOpen={this.state.snackOpen}
      //   snackOpen={this.state.snackOpen}
      //   {...other}
      // >
      <div style={{padding:24}}>
        <Grid container justify="center" spacing={1}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h4" style={{borderLeft: '5px solid #577BF9',paddingLeft: 15}}>Your Tip Pathways</Typography>
              <Table>
                <TableHead>
                  <TableRow></TableRow>
                </TableHead>
                <TableBody>{formRows}</TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h5" style={{borderLeft: '5px solid #577BF9',paddingLeft: 15,  marginBottom: 15}}>
                New Tip Pathway
              </Typography>
              <form onSubmit={this.createForm}>
                <TextField
                  label="Band or Group Name"
                  fullWidth
                  required
                  type="text"
                  variant="outlined"
                  onChange={this.handleChange("nickname")}
                />
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "15px", padding: "15px 80px" }}
                  type="submit"
                >
                  Create New Pathway
                </Button>
              </form>
            </Paper>
          </Grid>
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
      </div>
      // </NavBar>
    );
  }
}

/*PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};*/

export default withStyles(styles)(Page);
