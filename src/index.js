import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ComplexTree from "./ComplexTree";
import { makeServer } from "./server";

if (process.env.NODE_ENV === "development") {
  makeServer({ environment: "development" });
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  // <React.StrictMode>
  <>
    {/* <AsyncTree /> */}
    <ComplexTree />
    <App />
  </>,
  // </React.StrictMode>,
  rootElement
);
