import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./globalstyle.scss";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { privateRouter, publicRouter } from "./routers";
import { ToastProvider } from "react-toast-notifications";
import { io } from "socket.io-client";
const root = ReactDOM.createRoot(document.getElementById("root"));
const socket = io.connect("http://localhost:2401");
export const SocketIO = createContext()
root.render(
  <ToastProvider autoDismiss autoDismissTimeout={2000} placement="top-center">
    <SocketIO.Provider value={socket}>
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
            element={item.component}
          />
        ))}
        <Route key={10} path={"*"} element={"404 NOT FOUND"} />
      </Routes>
    </Router>
    </SocketIO.Provider>
  </ToastProvider>
);
