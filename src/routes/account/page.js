import React from "react";
import { Redirect } from "react-router-dom";
import PageLoader from "../../PageLoader";

export default function Page({ auth, profile }) {
  if (!auth.isLoaded || !profile.isLoaded) {
    return <PageLoader />;
  }
  if (auth.isEmpty) {
    return <Redirect to="/sign-in" />;
  }
  if (profile.isEmpty) {
    return <Redirect to="/create" />;
  }
  return <Redirect to={`/p/${profile.username}`} />;
}
