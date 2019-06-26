import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Page from "./page";

export default compose(
  firestoreConnect(({ match: { params } }) => [
    {
      collection: "people",
      doc: params.username,
      storeAs: "person"
    }
  ]),
  connect(({ firestore: { data, status }, firebase: { auth } }) => ({
    p:
      status.requested.person === true && status.requesting.person === false
        ? data.person
        : undefined,
    auth
  }))
)(Page);
