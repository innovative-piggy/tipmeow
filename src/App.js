import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Router, Route, Switch } from "react-router-dom";
import Login from "./views/login/login.jsx";
import Reset from "./views/login/reset.jsx";
import PasswordUpdate from "./views/login/passwordUpdate.jsx";
import SignUp from "./views/signup/signup.jsx";
import FormContainer from "./views/forms/formContainer.jsx";
import FormQrCode from "./views/forms/qrcode.jsx";
import Success from "./views/forms/success.jsx";
import yellow from "@material-ui/core/colors/yellow";
import blue from "@material-ui/core/colors/blue";
import UseRouter from './Router';
import PrivateRoute from './asset/common/PrivateRouter';
import history from './asset/common/history';
const primary = blue[500];

const PrimaryLayout = () => (
  <Switch>
    <Route path="/" exact component={Login} />
    <Route path="/login" exact component={Login} />
    <Route path="/reset" exact component={Reset} />
    <Route path="/update/:token" exact component={PasswordUpdate} />
    <Route path="/signup" exact component={SignUp} />
    <Route path="/p/:name" exact component={FormContainer} />
    <Route path="/p/:name/success" exact component={Success} />
    <Route path="/p/:name/qrcode" exact component={FormQrCode} />
    <PrivateRoute path="/" component={UseRouter} />
  </Switch>
);

const App = () => {
  let prefersDarkMode = localStorage.getItem("color_mode");
  if( prefersDarkMode === "undefined" || prefersDarkMode == undefined){
    prefersDarkMode = "light"
  }

  const theme = createMuiTheme({
    palette: {
      type: prefersDarkMode,
      primary: {
        main: primary
      },
      secondary: yellow,
      background: {
        default: "#E8EBF2"
      }
    },
    typography: {
      "fontFamily": `"Poppins", sans-serif`,
      "fontSize": 14,
      "fontWeightLight": 300,
      "fontWeightRegular": 400,
      "fontWeightMedium": 500
     }
  });

  return (
    <Router history={history}>
      <MuiThemeProvider theme={theme}>
        <PrimaryLayout />
      </MuiThemeProvider>
    </Router>
  );
};

export default App;
