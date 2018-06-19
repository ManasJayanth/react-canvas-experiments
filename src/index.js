import React from "react";
import { render } from "./renderer";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

function getComputedDimension(node, d) {
  return +window.getComputedStyle(node, null)[d].replace("px", "");
}

const canvas = document.getElementById("canvas");

const height = getComputedDimension(document.body, "height");
const width = getComputedDimension(document.body, "width");

canvas.height = height;
canvas.width = width;

render(<App height={height} width={width} />, canvas.getContext("2d"));
registerServiceWorker();
