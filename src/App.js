import React from "react";
import Store from "./Store";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";

function App() {
  return (
    <Store>
      <BrowserRouter>
        <div>
          <Header />
          <Main />
        </div>
      </BrowserRouter>
    </Store>
  );
}

export default App;
