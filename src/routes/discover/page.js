import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import PageLoader from "../../PageLoader";
import People from "./People";

function Page({ people }) {
  if (!people) {
    return <PageLoader />;
  }
  return <People people={people} />;
}

export default compose(
  firestoreConnect(({ where }) => [
    { collection: "people", where, limit: 24, storeAs: "people" }
  ]),
  connect(({ firestore: { ordered, status } }) => ({
    people:
      status.requested.people === true && status.requesting.people === false
        ? ordered.people
        : undefined
  }))
)(Page);
