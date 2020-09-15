import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import axios from "axios";
import "../../App.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
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

class PasswordUpdate extends React.Component {
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
      password: this.state.password
    };
    axios
      .put(`${apiBaseUrl}/v1/org/password/update/${this.props.match.params.token}`, payload)
      .then(function(response) {
        console.log(response);
        cogoToast.success("Your password has been updated successfully.");
        let path = `/login`;
        self.props.history.push(path);
      })
      .catch(function(error) {
        console.log(error);
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
            Enter your Password
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              onChange={this.handleChange("password")}
              required
              fullWidth
              id="password"
              label="New Password"
              name="password"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
                Update Password
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(PasswordUpdate);
