import React from "react";
import { withFirestore } from "react-redux-firebase";
import Autocomplete from "react-google-autocomplete";
import Loader from "../../Loader";
import "./Edit.css";

const linkNamePlaceholder = ["Twitter", "My Website", "Facebook", "Spotify"];
const linkUrlPlaceholder = [
  "https://twitter.com/account",
  "https://mywebsite.com/",
  "https://www.facebook.com/username",
  "https://open.spotify.com/user/account"
];
const getNextIndex = index => {
  return index >= 3 ? 0 : index + 1;
};

const patterns = {
  newLinkUrl: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
  email: /^.+@(([a-z\-0-9]+\.)+[a-z]{2,6})$/,
  bdayString: /^(19|20)\d\d([-/.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/
};

const convertLinksToString = links =>
  links.map(link => link.name + link.url).join();

const getUpdates = (prev, next) => {
  const updates = {};
  if (prev.name !== next.name) {
    updates.name = next.name;
    updates.nameSearch = next.name.toUpperCase();
    updates.nameArray = next.name.toUpperCase().split(" ");
  }
  if (prev.city !== next.city) {
    updates.city = next.city;
  }
  if (prev.email !== next.email) {
    updates.email = next.email;
  }
  if (prev.bdayString !== next.bdayString) {
    updates.bdayString = next.bdayString;
    updates.bday = next.bdayString ? new Date(next.bdayString).getTime() : null;
  }
  if (prev.identities.join(", ") !== next.identitiesString) {
    if (next.identitiesString.trim().length) {
      const newIdentitiesArray = next.identitiesString
        .split(",")
        .map(id => id.replace(",", "").trim());
      updates.identities = newIdentitiesArray;
      updates.identitiesSearch = newIdentitiesArray.map(id => id.toUpperCase());
    } else {
      updates.identities = [];
      updates.identitiesSearch = [];
    }
  }
  if (convertLinksToString(prev.links) !== convertLinksToString(next.links)) {
    updates.links = next.links.filter(
      link => !!link.name.length && !!link.url.length
    );
  }
  return updates;
};

class Edit extends React.Component {
  state = {
    name: this.props.p.name || "",
    city: this.props.p.city || "",
    email: this.props.p.email || "",
    bday: this.props.p.bday,
    bdayString: this.props.p.bdayString || "",
    identitiesString: this.props.p.identities.join(", "),
    links: this.props.p.links,
    newLinkName: "",
    newLinkUrl: "",
    newLinkUrlError: false,
    linkPlaceholderIndex: Math.floor(Math.random() * 4),
    hasLinkUrlError: false,
    emailError: false,
    nameError: false,
    bdayError: false,
    hasMadeChanges: false,
    isSaving: false
  };

  handleInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
      hasMadeChanges: true
    });
  };

  handleNameChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
      [`${name}Error`]: !value.trim().length,
      hasMadeChanges: true
    });
  };

  validateInput = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
      [`${name}Error`]: value.length ? !patterns[name].test(value) : false,
      hasMadeChanges: true
    });
  };

  addLink = () => {
    const { newLinkName, newLinkUrl } = this.state;
    if (
      newLinkName.length &&
      newLinkUrl.length &&
      patterns.newLinkUrl.test(newLinkUrl)
    ) {
      this.setState(prevState => ({
        newLinkName: "",
        newLinkUrl: "",
        links: [
          ...prevState.links,
          {
            name: prevState.newLinkName,
            url: prevState.newLinkUrl
          }
        ],
        linkPlaceholderIndex: getNextIndex(prevState.linkPlaceholderIndex),
        hasMadeChanges: true
      }));
    }
  };

  handleLinkNameChange = index => ({ target }) => {
    const { value } = target;
    this.setState(prevState => {
      const links = [...prevState.links];
      links.splice(index, 1, {
        ...prevState.links[index],
        name: value
      });
      return {
        links,
        hasMadeChanges: true
      };
    });
  };

  handleLinkUrlChange = index => ({ target }) => {
    const { value } = target;
    this.setState(prevState => {
      const links = [...prevState.links];
      const updatedLink = {
        name: prevState.links[index].name,
        url: value
      };
      const urlError = !patterns.newLinkUrl.test(value);
      if (urlError) {
        updatedLink.urlError = true;
      }
      links.splice(index, 1, updatedLink);
      return {
        links,
        hasLinkUrlError: urlError && !!value.length,
        hasMadeChanges: true
      };
    });
  };

  onPlaceSelected = place => {
    this.setState({
      city: place.formatted_address,
      hasMadeChanges: true
    });
  };

  save = () => {
    const { p, username, firestore } = this.props;
    const updates = getUpdates(p, { ...this.state });
    if (Object.keys(updates).length) {
      this.setState({
        isSaving: true
      });
      firestore
        .update({ collection: "people", doc: username }, updates)
        .then(() => {
          this.setState({
            isSaving: false,
            hasMadeChanges: false
          });
        });
    }
  };

  render() {
    const {
      name,
      city,
      bdayString,
      email,
      identitiesString,
      links,
      newLinkName,
      newLinkUrl,
      newLinkUrlError,
      linkPlaceholderIndex,
      hasLinkUrlError,
      nameError,
      emailError,
      bdayError,
      hasMadeChanges,
      isSaving
    } = this.state;
    return (
      <section id="account">
        <h1 className="title">Edit profile</h1>
        <div className="account-form">
          <div className="form-group">
            <label htmlFor="name-input">Name</label>
            <input
              type="text"
              id="name-input"
              name="name"
              className={`name-input${nameError ? " error" : ""}`}
              placeholder="Name"
              value={name}
              maxLength="120"
              required
              onChange={this.handleNameChange}
            />
          </div>
          {nameError && (
            <p className="input-error-text">Please enter a name.</p>
          )}

          <div className="form-group">
            <label htmlFor="city-input">City</label>
            <Autocomplete
              onPlaceSelected={this.onPlaceSelected}
              type="text"
              id="city-input"
              name="city"
              placeholder="City"
              maxLength="150"
              defaultValue={city}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email-input">Email</label>
            <input
              type="email"
              id="email-input"
              name="email"
              className={`email-input${emailError ? " error" : ""}`}
              placeholder="Email"
              value={email}
              maxLength="120"
              onChange={this.validateInput}
            />
          </div>
          {emailError && (
            <p className="input-error-text">Please enter a valid email.</p>
          )}

          <div className="form-group">
            <label htmlFor="birthday-input">Birthday</label>
            <input
              type="date"
              id="birthday-input"
              name="bdayString"
              className={`date-input${bdayError ? " error" : ""}`}
              placeholder="2018-12-31"
              min="1901-01-01"
              max="2019-01-01"
              value={bdayString}
              onChange={this.validateInput}
            />
          </div>
          {bdayError && (
            <p className="input-error-text">Please enter a valid date.</p>
          )}

          <div className="identities">
            <p className="form-group-title">Identities</p>
            <div className="form-group identities-group">
              <textarea
                type="text"
                id="identities-input"
                name="identitiesString"
                placeholder="Identities"
                maxLength="200"
                value={identitiesString}
                onChange={this.handleInputChange}
              />
            </div>
            <p className="input-helper-text mt">
              Separate identities with a comma.
            </p>
            {!!identitiesString.trim().length ? (
              <div className="identity-chips chips">
                {identitiesString
                  .trim()
                  .split(",")
                  .map((identity, index) => {
                    if (identity.replace(",", "").trim().length) {
                      return (
                        <div key={`${identity}-${index}`} className="chip">
                          <span className="chip-span">
                            {identity.replace(",", "").trim()}
                          </span>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
              </div>
            ) : (
              <div className="empty-identities">
                Add identities that describe you.
                <br />
                (Example: Dad, Husband, Activist, Photographer, Producer, NYU
                alum, ENFP, Motorcyclist, Basketball player, Buddhist, Canadian)
              </div>
            )}
          </div>

          <div className="links-group">
            <p className="form-group-title">Links</p>
            {links.length < 16 && (
              <div className="new-link">
                <div className="new-link-group">
                  <div className="form-group">
                    <label htmlFor="newLinkName-input">Name</label>
                    <input
                      type="text"
                      id="newLinkName-input"
                      name="newLinkName"
                      placeholder={linkNamePlaceholder[linkPlaceholderIndex]}
                      value={newLinkName}
                      maxLength="120"
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newLinkUrl-input">URL</label>
                    <input
                      type="text"
                      id="newLinkUrl-input"
                      name="newLinkUrl"
                      className={newLinkUrlError ? "error" : ""}
                      placeholder={linkUrlPlaceholder[linkPlaceholderIndex]}
                      value={newLinkUrl}
                      maxLength="240"
                      onChange={this.validateInput}
                    />
                  </div>
                </div>
                {newLinkUrlError && (
                  <p className="url-input-error input-error-text">
                    Please enter a valid URL.
                  </p>
                )}
                <button
                  id="add-link"
                  className="button"
                  onClick={this.addLink}
                  disabled={newLinkUrlError}
                >
                  Add new link
                </button>
              </div>
            )}
            {!!links.length ? (
              <div className="link-list">
                {links.map((link, index) => (
                  <div key={`link-${index}`}>
                    <div className="link-item">
                      <div className="form-group">
                        <label htmlFor={`link-name-input-${index}`}>Name</label>
                        <input
                          type="text"
                          id={`link-name-input-${index}`}
                          name="name"
                          placeholder="Name"
                          value={link.name}
                          maxLength="120"
                          onChange={this.handleLinkNameChange(index)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`link-url-input-${index}`}>URL</label>
                        <input
                          type="text"
                          id={`link-url-input-${index}`}
                          name="url"
                          placeholder="URL"
                          className={
                            !!link.urlError && !!link.url.length ? "error" : ""
                          }
                          value={link.url}
                          maxLength="240"
                          onChange={this.handleLinkUrlChange(index)}
                        />
                      </div>
                    </div>
                    {!link.name.length && !link.url.length && (
                      <p className="input-helper-text">
                        This link will be removed.
                      </p>
                    )}
                    {!link.name.length && !!link.url.length && (
                      <p className="input-error-text">
                        Please enter a name or the link will be removed.
                      </p>
                    )}
                    {!link.url.length && !!link.name.length && (
                      <p className="input-error-text">
                        Please enter a URL or the link will be removed.
                      </p>
                    )}
                    {!!link.urlError &&
                      !!link.name.length &&
                      !!link.url.length && (
                        <p className="url-input-error input-error-text">
                          Please enter a valid URL.
                        </p>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-link-list">
                Add links to your profiles and accounts on other websites or
                social media.
              </div>
            )}
          </div>

          <div id="save">
            {isSaving ? (
              <div style={{ margin: "1.5rem auto 2rem" }}>
                <Loader size={2.5} />
              </div>
            ) : (
              <button
                id="save-button"
                className="button primary-action"
                onClick={this.save}
                disabled={
                  !hasMadeChanges ||
                  (nameError || emailError || bdayError || hasLinkUrlError)
                }
              >
                Save
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default withFirestore(Edit);
