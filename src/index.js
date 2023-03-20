import React from "react";
import ReactDOM from "react-dom/client";
import "./globalstyle.scss";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { privateRouter, publicRouter } from "./routers";
import { CheckLogin } from "./components/checkLogin";
import { ToastProvider } from "react-toast-notifications";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ToastProvider autoDismiss autoDismissTimeout={2000} placement="top-center">
    <Router>
      <Routes>
        {publicRouter.map((item, index) => (
          <Route
            key={"public" + index}
            path={item.path}
            element={item.component}
          />
        ))}
        {privateRouter.map((item, index) => (
          <Route
            key={"private" + index}
            path={item.path}
            element={
              CheckLogin() === true ? (
                item.component
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        ))}
        <Route key={10} path={"*"} element={"404 NOT FOUND"} />
      </Routes>
    </Router>
  </ToastProvider>
);
