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
      formUrl: "",
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
      name: this.state.formUrl
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
          <TableCell>https://app.tipmeow.com/p/{form.name}</TableCell>
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              target="_blank"
              href={`/p/${form.name}`}
            >
              View
            </Button>
            <Button
              variant="contained"
              color="primary"
              href={`/page/${form._id}`}
            >
              Manage
            </Button>
            <Button
              variant="contained"
              color="primary"
              target="blank"
              href={`/p/${form._id}/qrcode`}
            >
              QR Code
            </Button>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <NavBar
        snackMessage={this.state.snackMessage}
        snackOpen={this.state.snackOpen}
        snackOpen={this.state.snackOpen}
        {...other}
      >
        <Grid container justify="center" spacing={1}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h5">Your Pages</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Page URL</TableCell>
                    <TableCell>View or Manage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{formRows}</TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography style={{ marginBottom: 15 }} variant="h5">
                New Page
              </Typography>
              <form onSubmit={this.createForm}>
                <TextField
                  label="Page URL"
                  fullWidth
                  required
                  type="text"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        https://app.tipmeow.com/p/
                      </InputAdornment>
                    )
                  }}
                  onChange={this.handleChange("formUrl")}
                />
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "15px", padding: "15px 80px" }}
                  type="submit"
                >
                  Create New Page
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
      </NavBar>
    );
  }
}

/*PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};*/

export default withStyles(styles)(Page);
