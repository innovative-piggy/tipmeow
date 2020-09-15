import React from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import cogoToast from "cogo-toast";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import { CirclePicker } from "react-color";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import NavBar from "../../components/navbar";

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
  tipField: {
    width: "100px"
  }
});

class ManagePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formUrl: "",
      forms: [],
      logoChange: new Date().getTime()
    };
  }
  componentDidMount() {
    var self = this;
    this.fetchForm();
    this.fetchPresignedUrl();
  }

  fetchForm = () => {
    var self = this;
    axios({
      method: "get",
      url: `${apiBaseUrl}/v1/forms/${this.props.match.params.id}`,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(function(response) {
        console.log(response);
        if (response.status === 200) {
          const form = response.data;
          self.setState({
            form: form,
            nickname: form.nickname,
            tip_amount_1: form.amounts[0],
            tip_amount_2: form.amounts[1],
            tip_amount_3: form.amounts[2],
            success_message: form.success_message,
            redirect_url: form.redirect_url,
            primary_color: form.primary_color,
            notification_number: form.notification_number
          });
        }
      })
      .catch(function(error) {
        console.log(error);
        self.showNotification("Error fetching forms.");
      });
  };

  deleteForm = () => {
    var self = this;
    const letsDelete = window.confirm("Are you sure you want to delete this?");
    if (letsDelete) {
      axios({
        method: "delete",
        url: `${apiBaseUrl}/v1/forms/${this.state.form._id}`,
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      })
        .then(function(response) {
          console.log(response);
          if (response.status === 200) {
            self.props.history.push(`/page`);
          }
        })
        .catch(function(error) {
          self.showNotification("Error deleting form.");
        });
    }
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

  updateForm = () => {
    var self = this;
    axios({
      method: "put",
      url: `${apiBaseUrl}/v1/forms/${this.props.match.params.id}`,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      data: {
        primary_color: this.state.primary_color,
        success_message: this.state.success_message,
        redirect_url: this.state.redirect_url,
        nickname: this.state.nickname,
        notification_number:
          this.state.notification_number &&
          this.state.notification_number.length === 10 //add the country code of 1 if they dont add it
            ? "1" + this.state.notification_number
            : this.state.notification_number,
        img: this.state.img,
        amounts: [
          this.state.tip_amount_1,
          this.state.tip_amount_2,
          this.state.tip_amount_3
        ]
      }
    })
      .then(response => {
        console.log(response);
        this.props.history.push("/page");
      })
      .catch(err => {
        console.log(err);
      });
  };

  fetchPresignedUrl = () => {
    var self = this;
    axios({
      method: "get",
      url: `${apiBaseUrl}/v1/forms/presignedurl/${this.props.match.params.id}`,
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(response => {
        console.log("PUTURL", response.data.put_url);
        self.setState({
          uploadUrl: response.data.put_url
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleColorChange = (color, name) => {
    console.log(color, name);
    this.setState({
      [name + "_color"]: color.hex
    });
  };

  uploadFile = event => {
    this.setState({
      fileUploading: true,
      response: "upload file was triggered",
      fetchUrl: null
    });
    var self = this;
    event.preventDefault();
    var formData = new FormData();
    var imageFile = document.querySelector("#file").files[0];
    axios
      .put(self.state.uploadUrl, imageFile, {
        headers: {
          "Content-Type": "image/*"
        }
      })
      .then(response => {
        self.setState({
          fileUploading: false,
          uploadedImage: this.state.fetchUrl,
          logoChange: new Date().getTime()
        });
        cogoToast.success("Your logo has been updated successfully.");
      })
      .catch(err => {
        self.setState({
          fileUploading: false,
          uploadedImage: this.state.fetchUrl,
          response: JSON.stringify(err)
        });
        console.log(err);
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
          <TableCell>https://tiptheband.com/p/{form._id}</TableCell>
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              target="blank"
              href={`/p/${form.name}`}
            >
              View
            </Button>
            <Button
              variant="contained"
              color="primary"
              target="blank"
              href={`/p/${form.name}/qrcode`}
            >
              QR Code
            </Button>
            <Button
              variant="contained"
              color="primary"
              target="blank"
              onClick={() => this.deleteForm(form._id)}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <NavBar {...other}>
        <Grid container justify="center">
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h5">
                Settings for your Tip Pathway called: {this.state.form && this.state.form.nickname}
                <br />
                <br />
              </Typography>
              <Grid container spacing={3}>
                {/* <Grid item xs={12}>
                  <img
                    key={this.state.logoChange}
                    style={{
                      maxHeight: "80px"
                    }}
                    src={`https://tipmeow.s3-us-west-2.amazonaws.com/${this
                      .state.form && this.state.form.org}/${this.state.form &&
                      this.state.form._id}?random=${this.state.logoChange}`}
                    alt="Your Image"
                  />

                  <form>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="file"
                      type="file"
                      //onInput={this.uploadFile}
                      onChange={this.uploadFile}
                    />
                    <label htmlFor="file">
                      <Button
                        variant="contained"
                        component="span"
                        color="primary"
                        className={classes.button}
                      >
                        Upload
                      </Button>
                    </label>
                  </form>
                </Grid> */}
                <Grid item xs={12}>
                  <Typography>Group Name</Typography>
                  <TextField
                    helperText="This band or group name will appear on your Tip Sign and Payment Form."
                    variant={"outlined"}
                    value={this.state.nickname}
                    onChange={this.handleChange("nickname")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Change the Primary Color</Typography>

                  <CirclePicker
                    onChange={color => this.handleColorChange(color, "primary")}
                    color={this.state.primary_color}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Preset Tip Amounts</Typography>

                  <TextField
                    required
                    type="number"
                    variant="outlined"
                    value={this.state.tip_amount_1}
                    className={classes.tipField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      )
                    }}
                    onChange={this.handleChange("tip_amount_1")}
                  />
                  <TextField
                    required
                    type="number"
                    value={this.state.tip_amount_2}
                    className={classes.tipField}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      )
                    }}
                    onChange={this.handleChange("tip_amount_2")}
                  />
                  <TextField
                    required
                    type="number"
                    value={this.state.tip_amount_3}
                    className={classes.tipField}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      )
                    }}
                    onChange={this.handleChange("tip_amount_3")}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <Typography>Success Message</Typography>
                  <TextField
                    id="standard-multiline-flexible"
                    //label="Success Message"

                    placeholder="Thanks for your support!"
                    helperText="We display this text on the page after tipping."
                    variant={"outlined"}
                    multiline
                    rows="3"
                    rowsMax="5"
                    value={this.state.success_message}
                    onChange={this.handleChange("success_message")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Redirect URL</Typography>
                  <TextField
                    id="standard-multiline-flexible"
                    //label="Success Message"

                    helperText="(optional) Your tippers will be sent here after they successfully tip."
                    placeholder="http://yourwebsite.com/thanks"
                    variant={"outlined"}
                    value={this.state.redirect_url}
                    onChange={this.handleChange("redirect_url")}
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <Typography>Notification Phone Number</Typography>
                  <TextField
                    id="standard-multiline-flexible"
                    //label="Success Message"

                    helperText="(optional) Recieve a text at this number when your tip is recieved."
                    placeholder="555-555-5555"
                    variant={"outlined"}
                    value={this.state.notification_number}
                    onChange={this.handleChange("notification_number")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container justify="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.updateForm}
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography style={{ marginBottom: 15 }} variant="h5">
                The Danger Zone
              </Typography>

              <Button
                variant="contained"
                style={{ backgroundColor: "red" }}
                type="submit"
                onClick={this.deleteForm}
              >
                Delete Page
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </NavBar>
    );
  }
}

/*PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};*/

export default withStyles(styles)(ManagePage);
