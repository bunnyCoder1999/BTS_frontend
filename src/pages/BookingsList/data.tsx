import { GridColDef } from "@mui/x-data-grid";
import { Booking } from "./types";
import dayjs from "dayjs";

export const columns: GridColDef<Booking>[] = [
	{
		field: "date",
		headerName: "Date",
		flex: 1,
		headerClassName: "list_table_header",
		resizable: false,
		disableColumnMenu: true,
		valueGetter: (value, row) => dayjs(row.date).format("DD/MM/YYYY"),
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
			const completed = dayjs(value.row.date).isBefore(dayjs());
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
