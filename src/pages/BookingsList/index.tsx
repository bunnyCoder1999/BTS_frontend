import { DataGrid } from "@mui/x-data-grid";
import "./style.css";
import { DatePicker } from "@mui/x-date-pickers";
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Booking } from "./types";
import { columns } from "./data";
import { keys, plants, vehicles } from "../../constants";
import { enqueueSnackbar } from "notistack";

const BookingList = () => {
	const [bookings, setBookings] = useState({ Brahmapuram: [] as Booking[], Willington: [] as Booking[] });

	const [date, setDate] = useState(dayjs());
	const [isLoading, setIsLoading] = useState(false);
	const [filters, setFilters] = useState({
		key: "" as keyof Booking,
		query: "",
		vehicle: null as unknown as (typeof vehicles)[number],
	});

	const navigate = useNavigate();

	useEffect(() => {
		const getBookings = async () => {
			try {
				setIsLoading(true);
				const { data } = await axios.get("http://127.0.0.1:8000/booking", {
					params: { date: date.format("DD/MM/YYYY") },
				});
				const _bookings: typeof bookings = { Brahmapuram: [], Willington: [] };
				const bookingsData = JSON.parse(data?.data || []) as Booking[];
				bookingsData.map(ele => _bookings?.[ele?.plant]?.push({ ...ele, id: ele.vehicle.number }));
				setBookings(_bookings);
			} catch (e: any) {
				enqueueSnackbar(e?.response?.data?.message || e?.toString?.(), { variant: "error" });
			} finally {
				setIsLoading(false);
			}
		};
		getBookings();
	}, [date]);

	const filteredBookings = useMemo(() => {
		const filterFn = (b: Booking) => {
			if (!filters.key) return true;
			const regex = new RegExp(filters.query, "ig");
			if (filters.key !== "vehicle") return b[filters.key]?.match(regex);
			return !filters.vehicle || b.vehicle.number === filters.vehicle?.number;
		};
		const Brahmapuram = bookings.Brahmapuram?.filter(filterFn);
		const Willington = bookings.Willington?.filter(filterFn);
		return { Willington, Brahmapuram };
	}, [filters, bookings]);

	return (
		<div className="list_container">
			<div className="list_header">
				<div className="list_date">
					<DatePicker
						sx={{ scale: "0.75", transformOrigin: "left top" }}
						value={date}
						onChange={date => setDate(date!)}
						format="DD/MM/YYYY"
					/>
				</div>
				<div className="list_keys">
					<FormControl fullWidth size="small">
						<InputLabel id="demo-simple-select-label">Select</InputLabel>
						<Select
							size="small"
							onChange={e =>
								setFilters(ps => ({ ...ps, key: e.target.value as keyof Booking }))
							}
							value={filters.key}
						>
							{keys.map(k => (
								<MenuItem value={k.value} key={k.value}>
									{k.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				{filters.key === "vehicle" && (
					<div className="list_vehicles">
						<Autocomplete
							options={vehicles}
							getOptionLabel={o => o.number}
							renderInput={props => (
								<TextField {...props} placeholder="Select vehicle number" />
							)}
							size="small"
							value={filters.vehicle}
							onChange={(e, v) => setFilters(ps => ({ ...ps, vehicle: v! }))}
							disableClearable
						/>
					</div>
				)}
				{filters.key !== "vehicle" && (
					<TextField
						placeholder="Search"
						size="small"
						value={filters.query}
						onChange={e => setFilters(ps => ({ ...ps, query: e.target.value }))}
					/>
				)}
				<Button
					startIcon={<IoMdAdd />}
					variant="contained"
					size="small"
					onClick={() => navigate("/create")}
				>
					Add new booking
				</Button>
			</div>
			{plants.map(p => (
				<div className="list_plant" key={p.label}>
					<h2>{p.label}</h2>
					<DataGrid
						rows={filteredBookings[p.label]}
						columns={columns}
						disableRowSelectionOnClick
						loading={isLoading}
						sx={{
							border: "none",
							borderRadius: "0.5rem",
							overflow: "hidden",
							table: { padding: "3rem" },
							"& .MuiDataGrid-cell": {
								border: "none",
								"&:focus": {
									outline: "none",
								},
							},
						}}
						autoPageSize
						pagination
					/>
				</div>
			))}
		</div>
	);
};

export default BookingList;
