import React from "react";
import "./Loader.css";

function Loader({ size }) {
  return (
    <div
      className="loader"
      style={{ width: `${size}rem`, height: `${size}rem` }}
    />
  );
}

export default Loader;
