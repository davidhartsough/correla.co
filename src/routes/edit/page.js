import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import PageLoader from "../../PageLoader";
import Edit from "./Edit";

function Page({ p, username }) {
  if (!p) {
    return <PageLoader />;
  }
  return <Edit p={p} username={username} />;
}

export default compose(
  firestoreConnect(({ username }) => [
    { collection: "people", doc: username, storeAs: "user" }
  ]),
  connect(({ firestore: { data } }) => ({ p: data.user }))
)(Page);
