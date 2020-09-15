import React from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Banner, StaticBanner } from "material-ui-banner";
import cogoToast from "cogo-toast";
import CircularProgress from "@material-ui/core/CircularProgress";
import NavBar from "../../components/navbar";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from "../../components/messages/customSnack";
import Player from "../../components/playSound.jsx";
const apiBaseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 20,
    paddingBottom: 50,
    minHeight: "500px",
    marginTop: theme.spacing.unit * 2,
    isLoading: true
  })
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: []
    };
  }
  componentDidMount() {
    var self = this;
    this.fetchMe();
  }

  fetchMe = () => {
    const self = this;
    axios({
      method: "get",
      url: `${apiBaseUrl}/v1/org/me`,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(function(response) {
        console.log(response.data);
        if (response.data.stripe_credentials) {
          self.setState({
            stripeConnected: true
          });
          self.fetchStripeStats();
        }
      })
      .catch(function(error) {
        cogoToast.error("Error retrieving profile from server.");
      });
  };

  fetchStripeStats = () => {
    const self = this;
    axios({
      method: "get",
      url: `${apiBaseUrl}/v1/org/stripe/stats`,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(function(response) {
        self.setState({ ...response.data, isLoading: false });
      })
      .catch(function(error) {
        cogoToast.error("Error retrieving metrics from server", {
          position: "bottom-center"
        });
        self.setState({ isLoading: false });
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

    return (
      <NavBar {...other}>
        <Grid
          container
          justify="center"
          alignContent="center"
          alignContent="center"
          spacing={2}
        >
          {/* <Banner icon={<div />} label="Text goes here" open /> */}
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>
              <Grid container justify="center">
                <Typography variant="h4">The Money Flow</Typography>
              </Grid>
              <br />
              <Grid
                container
                justify="center"
                alignItems="center"
                alignContent="center"
              >
                <Grid item>
                  {/* {!this.state.isLoading ? (
                    <Typography variant="h1" style={{ color: "green" }}>
                      ${this.state.balance && this.state.balance.pending[0].amount / 100}
                    </Typography>
                  ) : <CircularProgress />} */}
                  <br />
                  <br />
                  <strong>(1) Tip Sign</strong>
                  <br />
                  <br />
                  A Tip Sign invites people to tip you using their phone. Most phone cameras recognize a QR code, which tells the phone to display your Payment Form.
                  <br />
                  <br />
                  <strong>(2) Payment Form</strong>
                  <br />
                  <br />
                  The payment form shows 3 tip buttons. The person clicks the button they want, which starts Apple
                  Pay / Google Pay.
                  <br />
                  <br />
                  If Apple Pay and Google Pay are NOT set up on their phone,
                  they’ll see an error message. Most of the time, it’s because they did NOT use their
                      phone’s regular camera to “look” at your QR code (just like taking a pic)
                  <br />
                  <br />
                  <strong>(3) Your Bank Account</strong>
                  <br />
                  <br />
                  Money goes from Apple Pay / Google Pay through a credit card processing company called Stripe.com, and then to your bank account. Stripe takes 2.9% + 30 cents from each tip. This is the same as Square and other credit card processors.
                  <br />
                  <br />
                </Grid>
              </Grid>
              <br />
              <Grid
                container
                justify="center"
                alignItems="center"
                alignContent="center"
              >
                <Player url="https://tipmeow.s3-us-west-2.amazonaws.com/Cat-meow-audio-clip.mp3" />
              </Grid>
            </Paper>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>
              <Grid container justify="center">
                <Typography>Recent Tips</Typography>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>
              <Grid container justify="center">
                <Typography>Bank Payouts in Process</Typography>
              </Grid>
            </Paper>
          </Grid> */}
        </Grid>
      </NavBar>
    );
  }
}

/*PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};*/

export default withStyles(styles)(Dashboard);
