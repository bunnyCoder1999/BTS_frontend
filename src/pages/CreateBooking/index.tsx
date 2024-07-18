import {
    Autocomplete,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import "./style.css";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { FormEventHandler, useState } from "react";
import { plants, vehicles } from "../../constants";
import { createBooking } from "../../services";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";

const INITIAL_VALUES = {
    date: dayjs(),
    name: "",
    bookingId: "",
    plant: "",
    vehicle: null as unknown as (typeof vehicles)[number],
    loading: false,
};

type INITIAL_VALUES = typeof INITIAL_VALUES;

const CreateBooking = () => {
    const [data, setData] = useState(INITIAL_VALUES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const { bookingId, date, name, plant, vehicle, loading } = data;

    const handleCreateBooking: FormEventHandler<HTMLElement> = async e => {
        handleFormChange("loading", true);
        e.preventDefault();
        const { error, message } =
            (await createBooking({
                name,
                vehicle,
                plant,
                booking_id: bookingId,
                date: date.startOf("day").toISOString(),
                status: "Pending",
                forced: isModalOpen,
            })) || {};
        handleFormChange("loading", false);
        if (error && message?.match(/Vehicle no exists for given date/gi)) {
            setIsModalOpen(true);
        } else if (!error) {
            setData(INITIAL_VALUES);
            setIsModalOpen(false);
        }
    };

    const disabled = !name || !bookingId || !plant || !vehicle || loading;

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);

    function handleFormChange<T extends keyof INITIAL_VALUES>(key: T, value: INITIAL_VALUES[T]) {
        setData(ps => ({ ...ps, [key]: value }));
    }

    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <main className="create_container">
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle variant="h5" fontWeight={700}>
                    Confirm Booking
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This vehicles has already registered one or more booking in the given date, do you
                        want to add one more slot?
                    </DialogContentText>
                    <DialogActions sx={{ justifyContent: "space-between", paddingBlock: "2rem 1rem", px: 0 }}>
                        <Button variant="contained" size="large" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="info"
                            startIcon={
                                data.loading ? (
                                    <CircularProgress size={20} sx={{ color: "white" }} />
                                ) : (
                                    <IoMdAdd />
                                )
                            }
                            size="large"
                            onClick={handleCreateBooking}
                            disabled={data.loading}
                        >
                            Add
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <form className="create_form" onSubmit={handleCreateBooking}>
                <h1 className="title">
                    <IconButton onClick={() => navigate("/")}>
                        <FaArrowLeft />
                    </IconButton>
                    Create Booking
                </h1>
                {/* <img src={import.meta.env.VITE_APP_GIF_URL} className="gif" /> */}
                <DatePicker
                    value={date}
                    onChange={date => handleFormChange("date", date!)}
                    format="DD/MM/YYYY"
                    minDate={dayjs()}
                    maxDate={dayjs(maxDate)}
                />
                <TextField
                    placeholder="Enter Name"
                    label="Name"
                    value={name}
                    onChange={e => handleFormChange("name", e.target.value)}
                />
                <TextField
                    placeholder="Enter Booking ID"
                    label="Booking ID"
                    value={bookingId}
                    onChange={e => handleFormChange("bookingId", e.target.value)}
                />
                <Autocomplete
                    options={vehicles}
                    getOptionLabel={o => o.number}
                    renderInput={props => <TextField {...props} placeholder="Select vehicle number" />}
                    value={vehicle}
                    onChange={(e, v) => handleFormChange("vehicle", v)}
                    disableClearable
                />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Plant</InputLabel>
                    <Select onChange={e => handleFormChange("plant", e.target.value)} value={plant}>
                        {plants.map(p => (
                            <MenuItem value={p.label} key={p.label}>
                                {p.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="info" type="submit" disabled={disabled} size="large">
                    {loading ? <CircularProgress size={25} /> : "Create Booking"}
                </Button>
            </form>
            <div className="logo">
                <img
                    src={
                        "https://as1.ftcdn.net/v2/jpg/05/73/57/76/1000_F_573577614_3xNASp9y2eCUSXstGdXf9sKlW3ZYVyUr.jpg"
                    }
                    alt="logo"
                />
            </div>
        </main>
    );
};

export default CreateBooking;
