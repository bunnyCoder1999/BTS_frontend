import {
    Autocomplete,
    Button,
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

const CreateBooking = () => {
    const [date, setDate] = useState(dayjs());
    const [name, setName] = useState("");
    const [bookingId, setBookingId] = useState("");
    const [plant, setPlant] = useState("");
    const [vehicle, setVehicle] = useState(null as unknown as (typeof vehicles)[number]);
    const navigate = useNavigate();

    const handleCreateBooking: FormEventHandler<HTMLFormElement> = async e => {
        e.preventDefault();
        await createBooking({
            name,
            vehicle,
            plant,
            booking_id: bookingId,
            date: date.startOf("day").toISOString(),
        });
    };

    const disabled = !name || !bookingId || !plant || !vehicle;

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);

    return (
        <main className="create_container">
            <form className="create_form" onSubmit={handleCreateBooking}>
                <h1 className="title">
                    <IconButton onClick={() => navigate("/")}>
                        <FaArrowLeft />
                    </IconButton>
                    Create Booking
                </h1>
                {/* <p className="subtitle">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione obcaecati consectetur
                    eligendi dolore sequi commodi deserunt consequuntur nobis delectus laudantium!
                </p> */}
                <DatePicker
                    value={date}
                    onChange={date => setDate(date!)}
                    format="DD/MM/YYYY"
                    minDate={dayjs()}
                    maxDate={dayjs(maxDate)}
                />
                <TextField
                    placeholder="Enter Name"
                    label="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <TextField
                    placeholder="Enter Booking ID"
                    label="Booking ID"
                    value={bookingId}
                    onChange={e => setBookingId(e.target.value)}
                />
                <Autocomplete
                    options={vehicles}
                    getOptionLabel={o => o.number}
                    renderInput={props => <TextField {...props} placeholder="Select vehicle number" />}
                    value={vehicle}
                    onChange={(e, v) => setVehicle(v)}
                    disableClearable
                />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Plant</InputLabel>
                    <Select onChange={e => setPlant(e.target.value)} value={plant}>
                        {plants.map(p => (
                            <MenuItem value={p.label} key={p.label}>
                                {p.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="info" type="submit" disabled={disabled} size="large">
                    Create Booking
                </Button>
                <img src="https://www.icegif.com/wp-content/uploads/2022/01/icegif-965.gif" className="gif" />
            </form>
            <div className="logo">
                <img src={BTS} alt="logo" />
            </div>
        </main>
    );
};

export default CreateBooking;
