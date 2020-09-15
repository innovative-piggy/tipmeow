import React from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import qs from "query-string";
import NavBar from "../../components/navbar";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from "../../components/messages/customSnack";
const apiBaseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

const styles = theme => ({
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

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: [],
      stripeConnected: false
    };
  }
  componentDidMount() {
    var self = this;
    const query = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });

    this.fetchMe();

    if (query.code) {
      console.log(query);
      this.addStripe(query.code);
    }
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
        }
      })
      .catch(function(error) {
        self.showNotification("Error connecting to Stripe");
      });
  };

  addStripe = code => {
    const self = this;
    let payload = {
      code
    };
    axios({
      method: "post",
      url: `${apiBaseUrl}/v1/org/settings/stripe`,
      data: payload,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(function(response) {
        console.log(response);
        if (response.status === 200) {
          self.showNotification(
            "Stripe was connected successfully. You can now process payments.",
            "success"
          );
          self.setState({ stripeConnected: true });
        }
      })
      .catch(function(error) {
        self.showNotification("Error connecting to Stripe");
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

  render() {
    console.log(this.state);
    const { classes, ...other } = this.props;

    return (
      <NavBar {...other}>
        <Grid container justify="center" spacing={1}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h4">Payment Processing</Typography>
              <br/>
              {/* <Typography gutterBottom variant="h5">
                Payment Processing
              </Typography>
                <br/> */}
              <Typography variant="body2">
                {this.state.stripeConnected ? (
                  "Your Stripe account is already connected."
                ) : (
                  <div>
                    <Typography>
                      Apple Pay and Google Pay use credit cards to charge
                      customers.
                    </Typography>
                    <br/>
                    <Typography>
                      For credit card processing, we use a respected company
                      called Stripe. Stripe is similar to Square, which you've
                      probably seen, except Stripe focuses on online businesses
                      like TipMeow.
                    </Typography>
                    <br/>
                    <Typography>
                      Before you can start collecting tips through TipMeow,
                      you'll need a Stripe account. It takes 10 minutes to fill
                      out their online form. 9 out of 10 applications are
                      approved by Stripe instantly.
                    </Typography>
                    <br/>
                    <Typography>
                      Click the button below to go right to the Stripe form.
                      You'll be brought back here when you're done.
                    </Typography>
                    <br/>
                    <Typography>
                      If you already have a Stripe account, you'll be able to
                      use it... no need to make another.
                    </Typography>
                  </div>
                )}
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                disabled={this.state.stripeConnected}
                href={
                  "https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_GNqLEw8624zbLSJ2ecOaMXNtinF8ESCt&scope=read_write&redirect_uri=" +
                  "https://app.tipmeow.com/settings"
                }
                style={{ marginTop: "30px", padding: "15px 80px" }}
              >
                {this.state.stripeConnected
                  ? "Stripe is Connected"
                  : "Connect Stripe"}
              </Button>
              
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

export default withStyles(styles)(Settings);
