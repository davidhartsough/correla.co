import React from "react";
import { Link } from "react-router-dom";
import AccountIcon from "../../icons/AccountIcon";
import PlaceIcon from "../../icons/PlaceIcon";
import "./Person.css";

export default ({ person }) => (
  <Link to={`/p/${person.id}`} className="person-item">
    <div className="person-item-top">
      <div className="person-item-section">
        <div className="person-item-section-icon">
          <AccountIcon />
        </div>
        <div className="person-item-section-text person-name">
          {person.name}
        </div>
      </div>
      {!!person.city && !!person.city.length && (
        <div className="person-item-section person-city">
          <div className="person-item-section-icon">
            <PlaceIcon />
          </div>
          <div className="person-item-section-text">{person.city}</div>
        </div>
      )}
    </div>
    {!!person.identities && !!person.identities.length && (
      <div className="person-item-identities">
        {person.identities.join(", ")}
      </div>
    )}
  </Link>
);
