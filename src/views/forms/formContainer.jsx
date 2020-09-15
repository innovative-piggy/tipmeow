import React from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import axios from "axios";
import Form from "./form";
import { Typography } from "@material-ui/core";

const BASE_URL = process.env.REACT_APP_BASE_URL || "https://tipper-be.herokuapp.com";
class FormContainer extends React.Component {
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
          pkKey:
            (response.data.org.stripe_credentials &&
              response.data.org.stripe_credentials.stripe_publishable_key) ||
            null,
            ...response.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    const theme = createMuiTheme({
      palette: {
        primary: {
          main: this.state.primary_color || "#62a699" //set the primary color based on the settings of the form
        }
      }
    });
    console.log(this.state);
    return (
      <MuiThemeProvider theme={theme}>
        {this.state.pkKey ? (
          <StripeProvider
            apiKey={process.env.REACT_APP_PK_LIVE}
            key={this.state.org.stripe_credentials.stripe_user_id}
            stripeAccount={this.state.org.stripe_credentials.stripe_user_id}
          >
            <Elements>
              <Form
                testMode={false}
                passedData={this.state}
                {...this.props}
              />
            </Elements>
          </StripeProvider>
        ) : 
        // <Typography>
        //   This band has not set up their bank connection. 
        // </Typography>
        null
        }
      </MuiThemeProvider>
    );
  }
}

export default FormContainer;
