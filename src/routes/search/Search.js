import React from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";
import "./Search.css";

const params = ["name", "identities", "city"];

export default class Search extends React.Component {
  state = {
    name: sessionStorage.getItem("search_name") || "",
    identities: sessionStorage.getItem("search_identities") || "",
    city: sessionStorage.getItem("search_city") || this.props.city
  };

  handleInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  onPlaceSelected = place => {
    this.setState({
      city: place.formatted_address
    });
  };

  getSearch = () => {
    const search = params.reduce((acc, param) => {
      const p = this.state[param].trim();
      if (p) {
        acc[param] = p;
      }
      return acc;
    }, {});
    return "?" + queryString.stringify(search);
  };

  render() {
    const { name, identities, city } = this.state;
    return (
      <section id="search">
        <h1 className="title">Explore</h1>
        <div id="search-form">
          <div className="form-group">
            <label htmlFor="name-input">Name</label>
            <input
              type="text"
              id="name-input"
              name="name"
              placeholder="Name"
              value={name}
              maxLength="120"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city-input">City</label>
            <Autocomplete
              onPlaceSelected={this.onPlaceSelected}
              onChange={this.handleInputChange}
              type="text"
              id="city-input"
              name="city"
              placeholder="City"
              maxLength="150"
              defaultValue={city}
            />
          </div>
          <div className="form-group">
            <label htmlFor="identities">Identities</label>
            <input
              type="text"
              id="identities"
              name="identities"
              placeholder="Identities"
              value={identities}
              maxLength="120"
              onChange={this.handleInputChange}
            />
          </div>
          <p className="input-helper-text mtl">
            Separate identities with a comma.
          </p>
          <Link
            id="search-link"
            className="button primary-action"
            to={{
              pathname: "/discover",
              search: this.getSearch()
            }}
            disabled={
              name.length < 1 && identities.length < 1 && city.length < 1
            }
          >
            Search
          </Link>
        </div>
      </section>
    );
  }
}
