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
import cogoToast from "cogo-toast";
import MySnackbarContentWrapper from "../../components/messages/customSnack";
import { TableRowSkeleton } from "../../components/skeletons";
import { TableFooter } from "@material-ui/core";
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

function formatToCurrency(amount) {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

class Tips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formUrl: "",
      forms: [],
      payments: {
        data: []
      },
      has_more: false
    };
  }
  componentDidMount() {
    var self = this;
    this.fetchPayments();
  }

  fetchPayments = (cursor = "") => {
    var self = this;
    self.setState({
      isLoading: true
    });
    axios({
      method: "get",
      url: `${apiBaseUrl}/v1/org/stripe/payments?cursor=${cursor}`,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(function(response) {
        console.log(response);
        if (response.status === 200) {
          self.setState({
            payments: response.data,
            next_page: response.data.has_more
              ? response.data.data[response.data.data.length - 1].id
              : "", //gets the last id in the array
            previous_page:
              response.data.data.length > 0 ? response.data.data[0].id : "",
            has_more: response.data.has_more,
            isLoading: false
          });
        }
      })
      .catch(function(error) {
        console.log(error);
        self.setState({
            isLoading: false
        })
        cogoToast.error("Could not fetch recent tips. Please make sure your Stripe account is connected.", {
            position: "bottom-center"
          });
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
    for (const payment of this.state.payments.data) {
      formRows.push(
        <TableRow key={payment.id}>
          <TableCell>${formatToCurrency(payment.amount / 100)}</TableCell>
          <TableCell>{payment.status}</TableCell>
          <TableCell>
            {new Date(payment.created * 1000).toDateString()}
          </TableCell>
          <TableCell>{payment.metadata.form_name}</TableCell>
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
              <Typography variant="h5" style={{borderLeft: '5px solid #577BF9',paddingLeft: 15}}>Recent Tips</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Tip Pathway</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.isLoading ? <TableRowSkeleton rowCount={10} /> : formRows}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <Button
                      variant="outlined"
                      onClick={() => this.fetchPayments()}
                    >
                      Back
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => this.fetchPayments(this.state.next_page)}
                      disabled={!this.state.has_more}
                    >
                      Next
                    </Button>
                  </TableRow>
                </TableFooter>
              </Table>
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

export default withStyles(styles)(Tips);
