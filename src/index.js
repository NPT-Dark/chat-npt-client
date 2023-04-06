import React from "react";
import ReactDOM from "react-dom/client";
import "./globalstyle.scss";
import { ToastProvider } from "react-toast-notifications";
import App from "./app";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ToastProvider autoDismiss autoDismissTimeout={2000} placement="top-center">
    <App/>
  </ToastProvider>
);
