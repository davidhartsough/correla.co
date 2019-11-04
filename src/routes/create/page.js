import React from "react";
import { Redirect } from "react-router-dom";
import PageLoader from "../../PageLoader";
import Create from "./Create";

export default function Page({ auth, profile }) {
  if (!auth.isLoaded || !profile.isLoaded) {
    return <PageLoader />;
  }
  if (auth.isEmpty) {
    return <Redirect to="/sign-in" />;
  }
  if (!profile.isEmpty) {
    return <Redirect to="/edit" />;
  }
  return (
    <Create
      auth={auth}
      suggestion={auth.displayName.toLowerCase().replace(/ /g, "-")}
    />
  );
}
