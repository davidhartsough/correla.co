import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import PageLoader from "../../PageLoader";
import Search from "./Search";

function Page({ p, username }) {
  if (!username) {
    return <Search city="" />;
  }
  if (!p) {
    return <PageLoader />;
  }
  if (!p.city) {
    return <Search city="" />;
  }
  return <Search city={p.city} />;
}

export default compose(
  firestoreConnect(props => [
    { collection: "people", doc: props.username, storeAs: "user" }
  ]),
  connect(({ firestore: { data } }, props) => ({ p: data.user }))
)(Page);
