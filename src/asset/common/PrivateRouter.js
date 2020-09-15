import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function loggedIn() {
    console.log("loggedIn() was called");
    let token = localStorage.getItem("token");
    let timestamp = localStorage.getItem("timestamp");
    let potentialExp = timestamp / 1000 + 7200; // 2 hours after token was created in seconds
    /*Checks if there's a token in local storage and if the timestamp is older than 2 hours.
    These are simply quick front end checks. All auth is really done server side.
    */
    if (
    token != null &&
    timestamp != null &&
    potentialExp > new Date().getTime() / 1000
    ) {
    console.log("the user met logged in condition");
    return true;
    } else {
    console.log(" the user did NOT meet logged in condition");
    return false;
    }
}
// handle the private routes
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => (loggedIn() ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
    />
  );
}
export default PrivateRoute;