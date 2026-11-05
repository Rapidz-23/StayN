import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import theme from "./theme";
import App from "./App";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </DataProvider>
    </ThemeProvider>
  </StrictMode>
);
