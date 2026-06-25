import React from "react";
import "@fontsource/inter";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import {  ThemeProvider,  CssBaseline,} from "@mui/material";
import theme from "./theme";


ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AuthProvider>
          <App />
        </AuthProvider>

      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);