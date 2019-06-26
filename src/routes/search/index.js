import React from "react";
import { connect } from "react-redux";
import PageLoader from "../../PageLoader";
import Page from "./page";

function ProfileLoader({ profile }) {
  if (!profile.isLoaded) {
    return <PageLoader />;
  }
  return <Page username={profile.isEmpty ? null : profile.username} />;
}

export default connect(({ firebase: { profile } }) => ({
  profile
}))(ProfileLoader);
