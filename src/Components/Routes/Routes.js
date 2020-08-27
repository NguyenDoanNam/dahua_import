import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "../Auth/Login";
import Dashboard from "../Dashboard/Dashboard";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />
    </Switch>
  );
};

export default Routes;
