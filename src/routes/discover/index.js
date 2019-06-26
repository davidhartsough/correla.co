import React from "react";
import queryString from "query-string";
import Page from "./page";

function createWhere(q) {
  const where = [];
  if (q.name && q.name.length) {
    sessionStorage.setItem("search_name", q.name);
    const name = q.name.toUpperCase().trim();
    if (name.includes(" ")) {
      const names = name.split(" ").filter(n => n.length > 1);
      if (names.length > 1) {
        where.push(["nameSearch", "==", name]);
      } else {
        where.push(["nameArray", "array-contains", name]);
      }
    } else {
      where.push(["nameArray", "array-contains", name]);
    }
  } else {
    sessionStorage.setItem("search_name", "");
  }
  if (q.identities && q.identities.length) {
    sessionStorage.setItem("search_identities", q.identities);
    const identityString = q.identities.toUpperCase().trim();
    if (identityString.includes(",")) {
      const identities = identityString.split(",").map(i => i.trim());
      identities.forEach(identity => {
        where.push(["identitiesSearch", "array-contains", identity]);
      });
    } else {
      where.push(["identitiesSearch", "array-contains", identityString]);
    }
  } else {
    sessionStorage.setItem("search_identities", "");
  }
  if (q.city && q.city.length) {
    sessionStorage.setItem("search_city", q.city);
    where.push(["city", "==", q.city]);
  } else {
    sessionStorage.setItem("search_city", "");
  }
  return where;
}

function QueryGenerator({ location }) {
  return <Page where={createWhere(queryString.parse(location.search))} />;
}

export default QueryGenerator;
