import React from "react";
import { connect } from "react-redux";
import firebase from "firebase/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Redirect } from "react-router-dom";
import PageLoader from "../../PageLoader";

const uiConfig = {
  signInSuccessUrl: "/account",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID
  ]
};

function SignIn({ auth }) {
  if (!auth.isLoaded) {
    return <PageLoader />;
  }
  if (!auth.isEmpty) {
    return <Redirect to="/" />;
  }
  return (
    <section id="sign-in">
      <h1 className="title" style={{ textAlign: "center" }}>
        Sign in
      </h1>
      <div className="auth">
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    </section>
  );
}

export default connect(({ firebase: { auth } }) => ({ auth }))(SignIn);
