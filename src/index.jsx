import React from "react";
import { render } from "react-dom";
import App from "./Coins/components/App";

render(<App />, document.getElementById("root"));

if (process.env.NODE_ENV === "production") {
  require("offline-plugin/runtime").install();
}
