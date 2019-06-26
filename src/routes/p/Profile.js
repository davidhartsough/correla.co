import React from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import CakeIcon from "../../icons/CakeIcon";
import PlaceIcon from "../../icons/PlaceIcon";
import LogoutButton from "./LogoutButton";
import "./Profile.css";

export default ({
  name,
  age,
  city,
  identities,
  links,
  showAccountControls
}) => (
  <section id="profile">
    <h1 id="name-heading">{name}</h1>
    {(!!age || !!city) && (
      <h2 id="sub-heading">
        {!!age && (
          <span className="sub-heading-span">
            <CakeIcon />
            {age}
          </span>
        )}
        {!!city && (
          <span className="sub-heading-span">
            <PlaceIcon />
            {city}
          </span>
        )}
      </h2>
    )}
    {!!identities && (
      <div id="identities" className="chips profile-section">
        {identities.map((identity, index) => (
          <Link
            key={`${identity}-${index}`}
            to={{
              pathname: "/discover",
              search: "?" + queryString.stringify({ identities: identity })
            }}
            className="chip"
          >
            <span className="chip-span">{identity}</span>
          </Link>
        ))}
      </div>
    )}
    {!!links && !!identities && <hr />}
    {!!links && (
      <div id="links" className="chips profile-section">
        {links.map(({ name, url }, index) => (
          <a
            className="link-chip"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            key={`${name}-${index}`}
          >
            <span className="chip-span">{name}</span>
          </a>
        ))}
      </div>
    )}
    {showAccountControls && (
      <div className="account-buttons">
        <Link to="/edit" id="edit-button" className="account-button button">
          Edit profile
        </Link>
        <LogoutButton />
      </div>
    )}
  </section>
);
