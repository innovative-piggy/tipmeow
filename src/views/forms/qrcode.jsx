import Paper from "@material-ui/core/Paper";
import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import axios from "axios";
import QRCode from "qrcode.react";
const BASE_URL =
  process.env.REACT_APP_BASE_URL || "https://tipper-be.herokuapp.com";

const styles = theme => ({
  marks: {
    maxHeight: "50px"
  }
});

class Qrcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var self = this;
    const name = this.props.match.params.name;
    console.log(this.props.match);
    axios({
      method: "get",
      url: `${BASE_URL}/v1/forms/name/${name}`
    })
      .then(response => {
        console.log(response.data);
        self.setState({
          ...response.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  addDefaultSrc(ev) {
    ev.target.src =
      "https://tipmeow.s3-us-west-2.amazonaws.com/5dd43327fa16e86464233fac/tipmeowlogo.png";
  }

  render() {
    const { classes } = this.props;
    const name = this.props.match.params.name;

    return (
      <Grid
        container
        alignContent="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        spacing={2}
      >
        <Grid item xs={12}>
          <Grid container justify="center">
          <Typography id="name" variant="h3" style={{fontFamily: "Impact", color: this.state.primary_color}}>
                  {this.state.nickname}
          </Typography>
            {/* {this.state._id ? (
              <img
                style={{ maxWidth: "256px" }}
                src={`https://tipmeow.s3-us-west-2.amazonaws.com/${this.state
                  .org && this.state.org._id}/${this.state._id}`}
                alt="LOGO"
                onError={this.addDefaultSrc}
              />
            ) : null} */}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {this.state._id ? (
            <Grid container justify="center">
              <QRCode
                value={`https://app.tipmeow.com/p/${this.state._id}`}
                renderAs="canvas"
                size={256}
              />
            </Grid>
          ) : null}
        </Grid>
        <Grid item xs={6}>
          <Grid container justify="center">
            <img
              className={classes.marks}
              src={process.env.PUBLIC_URL + "/Apple_Pay_Mark.svg"}
            />
            <img
              className={classes.marks}
              src={process.env.PUBLIC_URL + "/google_pay_mark.svg"}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

/*PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};*/

export default withStyles(styles)(Qrcode);
