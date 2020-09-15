import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import GoogleLogin from "react-google-login";
import cogoToast from "cogo-toast";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from "../../components/messages/customSnack";
import axios from "axios";
import Container from "@material-ui/core/Container";
const apiBaseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        TipMeow
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: ""
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleGoogleSignup = googleUser => {
    var self = this;

    var payload = {
      google_token: googleUser.tokenObj.id_token
    };
    axios
      .post(`${apiBaseUrl}/v1/org/signup/google`, payload)
      .then(function(response) {
        console.log(response);
        if (response.status === 200) {
          self.storeValues(response);
        }
      })
      .catch(function(error) {
        console.log(error);
        cogoToast.error("This google profile or email was not found.");
      });
  };
  handleGoogleSignupFailure = err => {
    console.log(err);
  };

  handleSignup = ev => {
    ev.preventDefault();
    let self = this;
    let payload = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password
    };
    axios
      .post(`${apiBaseUrl}/v1/org`, payload)
      .then(function(response) {
        console.log(response);
        if (response.status === 200) {
          self.storeValues(response)
        }
      })
      .catch(function(error) {
        console.log(error);
        self.showNotification(
          "Could not sign you up. Please verify your email is correct"
        );
      });
  };

  storeValues = (response)=>{
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("timestamp", new Date().getTime());
    localStorage.setItem(
      "name",
      `${response.data.first_name} ${response.data.last_name}`
    );
    localStorage.setItem("first_name", response.data.first_name);
    localStorage.setItem("last_name", response.data.last_name);
    localStorage.setItem("user", response.data.user._id);
    localStorage.setItem("org", response.data.org._id);

    let path = `/settings`;
    this.props.history.push(path);
  }

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
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <img
            style={{ maxHeight: "100px" }}
            src={process.env.REACT_APP_LOGO_URL_1}
            alt="logo"
          />

          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} onSubmit={this.handleSignup}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  onChange={this.handleChange("first_name")}
                  autoFocus
                  autoComplete="fname"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  onChange={this.handleChange("last_name")}
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  type="email"
                  label="Email Address"
                  name="email"
                  onChange={this.handleChange("email")}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  onChange={this.handleChange("password")}
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      required
                      value="allowExtraEmails"
                      color="primary"
                    />
                  }
                  label="I accept the terms and conditions"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Login with Google"
              theme="dark"
              onSuccess={this.handleGoogleSignup}
              onFailure={this.handleGoogleLoginSignup}
              className="login-google-btn"
              cookiePolicy={"single_host_origin"}
            />
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
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
      </Container>
    );
  }
}

export default withStyles(styles)(SignUp);
