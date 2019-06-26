import React from "react";
import PageLoader from "../../PageLoader";
import Home from "./Home";

function Page({ auth, profile }) {
  if (!auth.isLoaded || !profile.isLoaded) {
    return <PageLoader />;
  }
  return <Home hasProfile={!profile.isEmpty} />;
}

export default Page;
