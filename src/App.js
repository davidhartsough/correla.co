import React from "react";
import Store from "./Store";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";

export default () => (
  <Store>
    <BrowserRouter>
      <>
        <Header />
        <Main />
      </>
    </BrowserRouter>
  </Store>
);
