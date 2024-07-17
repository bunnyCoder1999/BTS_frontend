import {
    Autocomplete,
    Button,
    CircularProgress,
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
import Logo from "../../assets/logo.jpg";
import BTS from "../../assets/bts.webp";
import { createBooking } from "../../services";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    const { bookingId, date, name, plant, vehicle, loading } = data;

    const handleCreateBooking: FormEventHandler<HTMLFormElement> = async e => {
        handleFormChange("loading", true);
        e.preventDefault();
        await createBooking({
            name,
            vehicle,
            plant,
            booking_id: bookingId,
            date: date.startOf("day").toISOString(),
            status: "Pending",
        });
        setData(INITIAL_VALUES);
    };

    const disabled = !name || !bookingId || !plant || !vehicle || loading;

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);

    function handleFormChange<T extends keyof INITIAL_VALUES>(key: T, value: INITIAL_VALUES[T]) {
        setData(ps => ({ ...ps, [key]: value }));
    }

    return (
        <main className="create_container">
            <form className="create_form" onSubmit={handleCreateBooking}>
                <h1 className="title">
                    <IconButton onClick={() => navigate("/")}>
                        <FaArrowLeft />
                    </IconButton>
                    Create Booking
                </h1>
                <img src={import.meta.env.VITE_APP_GIF_URL} className="gif" />

                {/* <p className="subtitle">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione obcaecati consectetur
                    eligendi dolore sequi commodi deserunt consequuntur nobis delectus laudantium!
                </p> */}
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
                <img src={Logo} alt="logo" />
            </div>
        </main>
    );
};

export default CreateBooking;
