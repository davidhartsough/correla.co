import React from "react";
import "./Loader.css";

export default ({ size }) => (
  <div
    className="loader"
    style={{ width: `${size}rem`, height: `${size}rem` }}
  />
);
