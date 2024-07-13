import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "./style.css";
import { DatePicker } from "@mui/x-date-pickers";
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

type Booking = {
	vehicle: {
		number: string;
		driver_name: string;
	};
	name: string;
	date: string;
	plant: "Brahmapuram" | "Willington";
	booking_id: string;
	id: string;
};

const columns: GridColDef<Booking>[] = [
	{
		field: "date",
		headerName: "Date",
		flex: 1,
		headerClassName: "list_table_header",
		resizable: false,
		disableColumnMenu: true,
	},
	{
		field: "booking_id",
		headerName: "Booking ID",
		flex: 1,
		headerClassName: "list_table_header",
		resizable: false,
		disableColumnMenu: true,
	},
	{
		field: "name",
		headerName: "Name",
		flex: 1,
		headerClassName: "list_table_header",
		resizable: false,
		disableColumnMenu: true,
	},
	{
		field: "vehicle",
		headerName: "Vehicle Number",
		flex: 1,
		headerClassName: "list_table_header",
		resizable: false,
		disableColumnMenu: true,
		valueGetter: (value, row) => row.vehicle.number,
	},
	{
		field: "status",
		headerName: "Status",
		flex: 1,
		headerClassName: "list_table_header",
		resizable: false,
		disableColumnMenu: true,
		renderCell: value => {
			const completed = new Date(value.row.date).getTime() > new Date().getTime();
			return (
				<div className="status_container">
					<div className={"status" + (completed ? "" : " pending")}>
						{completed ? "Completed" : "Pending"}
					</div>
				</div>
			);
		},
	},
];

const keys = [
	{
		label: "Name",
		value: "name",
	},
	{
		label: "Booking ID",
		value: "booking_id",
	},
	{
		label: "Vehicle number",
		value: "vehicle",
	},
];

const plants = [
	{
		label: "Willington",
	},
	{
		label: "Brahmapuram",
	},
] as const;

const vehicles = [
	{
		number: "KL-23423",
		driver: "asdasd",
	},
];

const BookingList = () => {
	const [bookings, setBookings] = useState({ Brahmapuram: [] as Booking[], Willington: [] as Booking[] });

	const [date, setDate] = useState(dayjs());
	const [isLoading, setIsLoading] = useState(false);
	const [filters, setFilters] = useState({
		key: "" as keyof Booking,
		query: "",
		vehicle: null as unknown as (typeof vehicles)[number],
	});

	useEffect(() => {
		const getBookings = async () => {
			try {
				setIsLoading(true);
				const { data } = await axios.get("http://127.0.0.1:8000/booking", {
					params: {
						date: date.format("DD/MM/YYYY"),
					},
				});
				const _bookings: typeof bookings = { Brahmapuram: [], Willington: [] };
				const bookingsData = JSON.parse(data?.data || []) as Booking[];
				bookingsData.map(ele => _bookings?.[ele?.plant]?.push({ ...ele, id: ele.booking_id }));
				setBookings(_bookings);
			} catch (e) {
				console.log(e);
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
								<MenuItem value={k.value}>{k.label}</MenuItem>
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
				{/* <Button startIcon={<IoSearch />} variant="contained" size="small">
					Search
				</Button> */}
			</div>
			{plants.map(p => (
				<div className="list_plant">
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
