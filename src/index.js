import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import App from "./App";
import registerServiceWorker from "./service-worker";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

registerServiceWorker();
