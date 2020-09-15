import Paper from "@material-ui/core/Paper";
import React from "react";
import axios from "axios";
import { injectStripe } from "react-stripe-elements";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from "../../components/messages/customSnack";
import { ButtonSkeleton } from "../../components/skeletons";
const apiBaseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 25,
    paddingBottom: 50,
    marginTop: theme.spacing.unit
  }),
  logo: {
    maxWidth: "200px",
    maxHeight: "300px"
  },
  tipOption: {
    minHeight: "120px",
    minWidth: "120px",
    //padding: theme.spacing(2),
    textAlign: "center",
    cursor: "pointer"
  },
  donateButton: {
    padding: "12px 16px"
  }
});

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canMakePayment: "loading",
      tipAmount: 1,
      primary_color: "grey",
      showCustomAmount: false,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.handlePaymentRequest();
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  /*INITIALIZES THE PAYMENT REQUEST BUTTON AND LISTENS FOR EVENTS*/
  handlePaymentRequest = () => {
    var self = this;
    const props = this.props;
    const paymentRequest = props.stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Tip",
        amount: self.state.tipAmount * 100
      }
      //requestPayerName: true,
      //requestPayerEmail: true
    });

    this.setState({ paymentRequest });

    paymentRequest.on("paymentmethod", async ev => {
      console.log(ev.paymentMethod.id);

      self.createIntent(
        ev.paymentMethod.id,
        self.props.passedData.org.stripe_credentials.stripe_user_id,
        ev
      );
    });

    /*CHECKS IF THE USE HAS APPLE PAY, GOOGLE PAY, OR CHROME PAY ENABLED*/
    paymentRequest.canMakePayment().then(result => {
      console.log("CAN MAKE PAYMENT", result);
      self.setState({
        canMakePayment: !!result
      });
    });
  };
  /*CREATES A PAYMENT INTENT IN STRIPE*/
  createIntent = (paymentMethod, stripeAccount, ev) => {
    var self = this;
    console.log(paymentMethod, stripeAccount);
    const payload = {
      form: self.props.passedData._id,
      form_name: self.props.passedData.name,
      payment_method: paymentMethod,
      stripe_account: stripeAccount,
      amount_in_cents: this.state.tipAmount * 100
    };
    console.log("PAYLOAD", this.state.tipAmount);
    axios
      .post(`${apiBaseUrl}/v1/forms/payment-intent`, payload)
      .then(function(response) {
        const paymentIntent = response.data;
        self.confirmPayment(paymentIntent.client_secret, paymentIntent, ev);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  /*CONFIRMS THE PAYMENT BASED ON PAYMENT INTENT SECRET*/
  confirmPayment = async (clientSecret, paymentIntent, ev) => {
    const result = await this.props.stripe.confirmCardPayment(
      clientSecret,
      { payment_method: ev.paymentMethod.id },
      { handleActions: false }
    );
    console.log(result);
    if (result.error) {
      // Report to the browser that the payment failed, prompting it to
      // re-show the payment interface, or show an error message and close
      // the payment interface.
      ev.complete("fail");
      this.showNotification(
        "Could not charge that payment method. Please select another and try again.",
        "error"
      );
    } else {
      // Report to the browser that the confirmation was successful, prompting
      // it to close the browser payment method collection interface.
      ev.complete("success");

      const payload = {
        pi_id: paymentIntent.id,
        form: this.props.passedData._id
      };
      axios.post(`${apiBaseUrl}/v1/forms/notify/text`, payload);

      this.props.history.push({
        pathname: `/p/${this.props.match.params.name}/success`
        //state: { passedData: response.data }
      });

      //this.showNotification("Your tip was recieved. Thank you!", "success");
    }
  };

  handleTipChange = amount => {
    console.log(amount);
    this.setState({ tipAmount: amount });
  };

  showPayment = amount => {
    console.log("AMOUNT", amount);
    this.state.paymentRequest.update({
      total: {
        amount: amount * 100,
        label: "Tip"
      }
    });
    this.setState({
      tipAmount: Number(amount)
    });

    this.state.paymentRequest.show();
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

  handleSubmit = event => {
    event.preventDefault();
  };
  addDefaultSrc(ev) {
    ev.target.src = "https://tipmeow.s3-us-west-2.amazonaws.com/tip_logo.png";
  }

  render() {
    console.log("PROPS", this.props, "STATE", this.state);
    const { classes } = this.props;
    const tipAmounts = [];
    for (const amount of this.props.passedData.amounts) {
      tipAmounts.push(
        <Grid item xs={12}>
          <Button
            fullWidth
            className={classes.donateButton}
            color="primary"
            variant="contained"
            onClick={() => this.showPayment(amount)}
          >
            Tip ${amount}
          </Button>
        </Grid>
      );
    }

    return (
      <div style={{ backgroundColor: "#f1f1f1" }}>
        <Grid
          container
          spacing={1}
          direction="row"
          alignContent="center"
          alignItems="center"
          justify="center"
          style={{
            minHeight: "100vh"
            //alignItems: "center"
          }}
        >
          <Grid item md={3} xs={12}>
            <Paper
              className={classes.paper}
              style={{
                minWidth: 300,
                visibility: this.state.width < 700 ? undefined : undefined
              }}
            >
              <Grid container justify="center">
                {/* <img
                  style={{ maxHeight: "200px", paddingBottom: "10px" }}
                  src={`https://tipmeow.s3-us-west-2.amazonaws.com/${
                    this.props.passedData.org._id
                  }/${
                    this.props.passedData._id
                  }?random=${new Date().getTime()}`}
                  alt="LOGO"
                  onError={this.addDefaultSrc}
                /> */}
                <Typography
                  variant="h4"
                  style={{
                    fontFamily: "Impact",
                    color: this.props.passedData.primary_color
                  }}
                >
                  {this.props.passedData.nickname}
                </Typography>
              </Grid>
              <br />
              <Grid
                container
                spacing={1}
                direction="row"
                alignContent="center"
                alignItems="stretch"
                justify="center"
              >
                {this.state.showCustomAmount === false &&
                this.state.canMakePayment === true ? (
                  <React.Fragment>
                    {tipAmounts}
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        className={classes.donateButton}
                        color="primary"
                        variant="contained"
                        onClick={() =>
                          this.setState({
                            showCustomAmount: !this.state.showCustomAmount
                          })
                        }
                      >
                        Specify Amount
                      </Button>
                    </Grid>
                  </React.Fragment>
                ) : null}
                {this.state.showCustomAmount &&
                this.state.canMakePayment === true ? (
                  <React.Fragment>
                    <Grid item xs={12}>
                      <TextField
                        label="Tip Amount"
                        fullWidth
                        required
                        type="number"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          )
                        }}
                        onChange={this.handleChange("tipAmount")}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        className={classes.donateButton}
                        color="primary"
                        variant="contained"
                        onClick={() =>
                          this.showPayment(Number(this.state.tipAmount))
                        }
                      >
                        Tip
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        className={classes.donateButton}
                        //color="primary"
                        variant="outlined"
                        onClick={() =>
                          this.setState({
                            showCustomAmount: !this.state.showCustomAmount
                          })
                        }
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </React.Fragment>
                ) : null}
                {this.state.canMakePayment === false ? (
                  <Grid item xs={12}>
                    <br />
                    <Typography>
                      Did you use your phone's REGULAR camera to "look" at the
                      tip sign? Do NOT use a special QR app.
                    </Typography>
                    <br />
                    <Typography>
                      It looks like Apple Pay and Google Pay are not set up.
                    </Typography>
                    <br />
                  </Grid>
                ) : null}
                {this.state.canMakePayment === "loading" ? (
                  <React.Fragment>
                    <Grid item xs={12}>
                      <ButtonSkeleton />
                    </Grid>
                    <Grid item xs={12}>
                      <ButtonSkeleton />
                    </Grid>
                    <Grid item xs={12}>
                      <ButtonSkeleton />
                    </Grid>
                    <Grid item xs={12}>
                      <ButtonSkeleton />
                    </Grid>
                  </React.Fragment>
                ) : null}
              </Grid>
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
    );
  }
}
/*PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};*/

export default injectStripe(withStyles(styles)(Form));
//export default injectStripe(Form);
