import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import axios from "axios";
import "../../App.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import GoogleLogin from "react-google-login";
import cogoToast from "cogo-toast";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
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
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // window.gapi.signin2.render("g-signin2", {
    //   client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    //   //scope: "https://www.googleapis.com/auth/plus.login",
    //   scope:"profile email",
    //   width: "100%",
    //   height: 50,
    //   longtitle: true,
    //   //theme: "light",
    //   onsuccess: this.handleGoogleLogin(),
    //   onfailure: this.handleGoogleLoginFailure()
    // });
  }

  handleGoogleLogin = googleUser => {
    var self = this;

    var payload = {
      google_token: googleUser.tokenObj.id_token
    };
    axios
      .post(`${apiBaseUrl}/v1/org/login/google`, payload)
      .then(function(response) {
        console.log(response);
        if (response.status === 200) {
          self.storeValues(response);
        }
      })
      .catch(function(error) {
        console.log(error)
        cogoToast.error("This google profile or email was not found.");
      });
  };
  handleGoogleLoginFailure = err => {
    console.log(err);
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state);
    var self = this;

    var payload = {
      email: this.state.username,
      password: this.state.password
    };
    axios
      .post(`${apiBaseUrl}/v1/org/login`, payload)
      .then(function(response) {
        console.log(response);
        if (response.status === 200) {
          self.storeValues(response);
        }
      })
      .catch(function(error) {
        console.log(error);
        self.setState({
          usernameMessage: "Incorrect Username or Password",
          passwordMessage: "Incorrect Username or Password",
          usernameInvalid: true,
          passwordInvalid: true
        });
      });
  };

  storeValues = response => {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("timestamp", new Date().getTime());
    localStorage.setItem(
      "name",
      `${response.data.user.first_name} ${response.data.user.last_name}`
    );
    localStorage.setItem("first_name", response.data.user.first_name);
    localStorage.setItem("last_name", response.data.user.last_name);
    localStorage.setItem("user_id", response.data._id);
    localStorage.setItem("gravatar", response.data.gravatar);

    let path = `/dashboard`;
    this.props.history.push(path);
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
            Sign In
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              onChange={this.handleChange("username")}
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              onChange={this.handleChange("password")}
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Login with Google"
              theme="dark"
              onSuccess={this.handleGoogleLogin}
              onFailure={this.handleGoogleLoginFailure}
              className="login-google-btn"
              cookiePolicy={"single_host_origin"}
            />
            <Grid container>
              <Grid item xs>
                <Link href="/reset" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

export default withStyles(styles)(Login);
