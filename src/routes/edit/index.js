import React from "react";
import { Redirect } from "react-router-dom";
import PageLoader from "../../PageLoader";
import { connect } from "react-redux";
import Page from "./page";

function AuthLoader({ auth, profile }) {
  if (!auth.isLoaded || !profile.isLoaded) {
    return <PageLoader />;
  }
  if (auth.isEmpty) {
    return <Redirect to="/sign-in" />;
  }
  if (profile.isEmpty) {
    return <Redirect to="/create" />;
  }
  return <Page username={profile.username} />;
}

export default connect(({ firebase: { auth, profile } }) => ({
  auth,
  profile
}))(AuthLoader);
