import React from "react";
import { render } from "react-dom";
import AppController from "./components/app";

if (typeof document !== "undefined") {
  document.readyState === "complete"
    ? init()
    : document.addEventListener("DOMContentLoaded", init);
}

let _rootNode;

function init() {
  _rootNode = _rootNode || document.createElement("div");
  render(<AppController />, _rootNode);
}

export default { init };
