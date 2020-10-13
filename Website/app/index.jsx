import React from "react";
import ReactDOM from "react-dom";
import App from "./src/App";
import { SnackbarProvider } from "notistack";
import { SocketIOProvider } from "./src/services";

ReactDOM.render(
  <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
    <SocketIOProvider>
      <App />
    </SocketIOProvider>
  </SnackbarProvider>,
  document.getElementById("root")
);
