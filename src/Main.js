import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import {
  Home,
  Search,
  Discover,
  Profile,
  Account,
  SignIn,
  Create,
  Edit
} from "./routes";
import "./Main.css";

const NoMatch = () => <Redirect to="/" />;

function Main() {
  return (
    <main>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/search" component={Search} />
        <Route path="/discover" component={Discover} />
        <Route path="/p/:username" component={Profile} />
        <Route path="/account" component={Account} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/create" component={Create} />
        <Route path="/edit" component={Edit} />
        <Route component={NoMatch} />
      </Switch>
    </main>
  );
}

export default Main;
