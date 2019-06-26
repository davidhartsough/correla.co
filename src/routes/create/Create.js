import React from "react";
import { withFirestore } from "react-redux-firebase";
import { Redirect } from "react-router-dom";
import PageLoader from "../../PageLoader";
import "./Create.css";

const usernamePattern = /^[a-z0-9-]{3,36}$/;

class Create extends React.Component {
  state = {
    username: this.props.suggestion,
    inputError: false,
    isChecking: false,
    isTaken: false,
    lastInput: "",
    successRedirect: false
  };

  handleInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
      inputError: !usernamePattern.test(value)
    });
  };

  tryNext = () => {
    const { username } = this.state;
    this.setState({
      lastInput: username,
      isChecking: true
    });
    const { firestore, firebase, auth } = this.props;
    firestore.get(`people/${username}`).then(doc => {
      if (doc.exists) {
        this.setState({
          isTaken: doc.exists,
          isChecking: false
        });
      } else {
        const { uid, displayName, email } = auth;
        const name = displayName && displayName.length ? displayName : "";
        const upperCaseName = name ? name.toUpperCase() : "";
        const newPerson = {
          uid,
          email,
          name,
          nameSearch: upperCaseName,
          nameArray: name ? upperCaseName.split(" ") : [],
          identities: [],
          identitiesSearch: [],
          city: "",
          links: [],
          bday: null,
          bdayString: ""
        };
        firestore
          .set({ collection: "people", doc: username }, newPerson)
          .then(() => {
            firebase.updateProfile({ username });
            this.setState({ successRedirect: true });
          });
      }
    });
  };

  render() {
    const {
      username,
      inputError,
      lastInput,
      isTaken,
      isChecking,
      successRedirect
    } = this.state;
    if (isChecking) {
      return <PageLoader />;
    }
    if (successRedirect) {
      return <Redirect to="/edit" />;
    }
    return (
      <section id="create">
        <h1 className="title">Choose a username</h1>
        <input
          type="text"
          id="username-input"
          className={inputError ? "error" : ""}
          name="username"
          placeholder="Username"
          value={username}
          maxLength="36"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          pattern="[a-z0-9-]{3,36}"
          onChange={this.handleInputChange}
        />
        {inputError ? (
          <p id="username-input-error" className="input-error-text">
            Usernames can only contain lowercase alphanumeric characters and
            hyphens and must be at least 3 characters long.
          </p>
        ) : (
          <p className="input-helper-text">
            {!!lastInput && !!isTaken
              ? `Sorry, "${lastInput}" is already taken.`
              : "If the username is available, you can keep it!"}
          </p>
        )}
        <button
          id="next"
          className="button primary-action"
          onClick={this.tryNext}
          disabled={inputError}
        >
          Next
        </button>
      </section>
    );
  }
}

export default withFirestore(Create);
