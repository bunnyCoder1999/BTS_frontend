import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./index.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";

const darkTheme = createTheme({
    palette: { mode: "dark", primary: { main: "#313131" } },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={darkTheme}>
                <SnackbarProvider variant="success">
                    <App />
                </SnackbarProvider>
            </ThemeProvider>
        </LocalizationProvider>
    </React.StrictMode>,
);
