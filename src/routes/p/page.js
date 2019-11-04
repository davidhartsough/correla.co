import React from "react";
import PageLoader from "../../PageLoader";
import Profile from "./Profile";

const calculateAge = birthday => {
  const ageDate = new Date(Date.now() - birthday);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const verify = data => (!!data && !!data.length ? data : false);

const getLinks = (links, email) => {
  const linkList = !!links ? [...links] : [];
  if (email) {
    linkList.unshift({
      name: "Email",
      url: `mailto:${email}`
    });
  }
  return linkList;
};

export default function Page({ p, match, auth }) {
  if (typeof p === "undefined") {
    return <PageLoader />;
  } else if (!p) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        {`No person found with the username "${match.params.username}".`}
      </div>
    );
  }
  return (
    <Profile
      name={p.name}
      age={!!p.bday ? calculateAge(p.bday) : false}
      city={p.city}
      identities={verify(p.identities)}
      links={getLinks(verify(p.links), p.email)}
      showAccountControls={p.uid === auth.uid}
    />
  );
}
