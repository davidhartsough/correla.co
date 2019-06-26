import React from "react";
import { withFirebase } from "react-redux-firebase";
import { withRouter } from "react-router";

function LogoutButton({ firebase, history }) {
  const onClick = () => {
    firebase.logout();
    history.push("/sign-in");
  };
  return (
    <button
      id="exit-button"
      className="account-button button"
      onClick={onClick}
    >
      Sign out
    </button>
  );
}

export default withRouter(withFirebase(LogoutButton));
