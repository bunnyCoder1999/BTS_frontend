import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookingList from "./pages/BookingsList";
import CreateBooking from "./pages/CreateBooking";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";

function App() {
    const passKey = sessionStorage.getItem("pass_key");
    const [key, setKey] = useState("");
    const handleVerifyKey = () => {
        if (key !== import.meta.env.VITE_APP_PASS_KEY) return enqueueSnackbar("Invalid key", { variant: "error" });
        sessionStorage.setItem("pass_key", key);
        setKey("");
    };
    return (
        <BrowserRouter>
            <Dialog open={!passKey} fullWidth maxWidth="xs">
                <DialogTitle variant="h5" fontWeight={700}>
                    Code para
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>Sadhanam kayyil ondo?</DialogContentText>
                    <TextField
                        autoComplete="off"
                        value={key}
                        onChange={e => setKey(e.target.value)}
                        placeholder="Enter Key"
                        fullWidth
                        size="small"
                        margin="dense"
                        type="password"
                    />
                    <DialogActions sx={{ paddingBlock: "2rem 1rem", px: 0 }}>
                        <Button variant="contained" color="info" size="large" onClick={handleVerifyKey}>
                            Verify
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Routes>
                <Route path="/" element={<BookingList />} />
                <Route path="/create" element={<CreateBooking />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
