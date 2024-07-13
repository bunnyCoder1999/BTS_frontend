import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "./style.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";

const data = [
  {
    vehicle: {
      number: "sadsadasd",
      driver_name: "sdfsdfsdfds",
    },
    name: "sasdasa",
    date: "07/12/2024",
    plant: "sfdsffsd",
    booking_id: "asda",
    id: 1,
  },
];

const columns: GridColDef<(typeof data)[number]>[] = [
  { field: "date", headerName: "Date", width: 150 },
  {
    field: "booking_id",
    headerName: "Booking ID",
    width: 200,
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
  },
  {
    field: "vehicle",
    headerName: "Vehicle Number",
    width: 190,
    valueGetter: (value: any, row) => value.number,
  },
];

const keys = [
  {
    label: "Name",
    id: "name",
  },
  {
    label: "Booking ID",
    value: "booking_id",
  },
  {
    label: "Vehicle number",
    value: "vehicle_number",
  },
];

const index = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const getBookings = async () => {
      const { data } = await axios.get(
        "http://127.0.0.1:8000/booking?date=12/07/2024"
      );
      setBookings(
        JSON.parse(data?.data || [])?.map((ele) => ({
          ...ele,
          id: ele.booking_id,
        }))
      );
    };
    getBookings();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="list_container">
        <div className="list_header">
          <div className="list_date">
            <DatePicker />
          </div>
          <div className="list_keys">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Select</InputLabel>
              <Select fullWidth>
                {keys.map((k) => (
                  <MenuItem value={k.value}>{k.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <TextField placeholder="Search" />
          <Button startIcon={<IoSearch />} variant="contained">
            Search
          </Button>
        </div>
        <div className="list_plant">
          <h2>Willington</h2>
          <DataGrid
            rows={bookings}
            columns={columns}
            disableRowSelectionOnClick
          />
        </div>
        <div className="list_plant">
          <h2>Brahmapuram</h2>
          <DataGrid
            rows={bookings}
            columns={columns}
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default index;
