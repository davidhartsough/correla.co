import React from "react";
import { Provider } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { createStore, combineReducers } from "redux";
import {
  ReactReduxFirebaseProvider,
  firebaseReducer
} from "react-redux-firebase";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwFsI5UWozqYi5TrO2BOUYVBECzr6r43E",
  authDomain: "correla-app.firebaseapp.com",
  databaseURL: "https://correla-app.firebaseio.com",
  projectId: "correla-app",
  storageBucket: "correla-app.appspot.com",
  messagingSenderId: "963552926535",
  appId: "1:963552926535:web:9cc6603c2c4960ab"
};
firebase.initializeApp(firebaseConfig);
firebase.firestore();

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer
});
const store = createStore(rootReducer);

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true
};
const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};

export default function Store({ children }) {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        {children}
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}
